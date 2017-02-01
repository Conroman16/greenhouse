let _ = require('underscore');
let router = require('express').Router();
let viewData = require('../lib/viewdata');
let config = require('../lib/config');
let server = require('../lib/server');
let gpio = require('../lib/gpio');
let devices = require('../lib/device');
let scheduler = require('../lib/scheduler');
let db = require('../db');
let async = require('async');

module.exports = () => {

	router.get('/create', (req, res) => {
		res.render('device/action', {
			action: 'create',
			DeviceTypes: _.map(devices.types, (value, key) => {
				return {
					Name: key,
					Value: value
				};
			}),
			Outlets: _.map(gpio.outlets, (outlet) => {
				return {
					Value: outlet.id
				};
			}),
			Sensors: _.map(gpio.sensors, (sensor) => {
				return {
					Value: sensor.pin
				};
			})
		});
	});

	router.post('/create', (req, res) => {
		let outletId = req.body.outletId;
		let sensorId = req.body.sensorId;
		let deviceType = req.body.deviceType;
		let deviceName = req.body.deviceName;
		let deviceDescription = req.body.deviceDescription;
		let defaultSetting = !!JSON.parse(req.body.defaultSetting);
		let isPaused = !!JSON.parse(req.body.isPaused);

		if ((!outletId && !sensorId) || !deviceType || !deviceName)
			return res.sendStatus(500);
		else if (sensorId == -1)
			sensorId = null;

		devices.createDevice(outletId, sensorId, deviceType, deviceName, deviceDescription, defaultSetting, isPaused)
			.then((d) => res.sendStatus(200))
			.catch((err) => {
				res.status(500).send(err);
				console.error(err);
			});
	});

	router.post('/edit', (req, res) => {
		let deviceId = req.body.deviceId;
		let outletId = req.body.outletId;
		let sensorId = req.body.sensorId;
		let deviceType = req.body.deviceType;
		let deviceName = req.body.deviceName;
		let deviceDescription = req.body.deviceDescription;
		let defaultSetting = !!JSON.parse(req.body.defaultSetting);
		let isPaused = !!JSON.parse(req.body.isPaused);

		if (!deviceId || deviceId == -1 || !outletId || !deviceType || !deviceName)
			return res.sendStatus(500);
		else if (sensorId == -1)
			sensorId = null;

		devices.update({
			id: deviceId,
			outletId: outletId,
			sensorId: sensorId,
			type: deviceType,
			name: deviceName,
			description: deviceDescription,
			defaultSetting: defaultSetting,
			isPaused: isPaused
		})
		.then((updatedDevice) => res.sendStatus(200))
		.catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.get('/edit/:id', (req, res) => {
		var deviceId = req.params.id;
		if (!deviceId)
			return res.status(500).redirect('/device/list');

		let vd = { action: 'edit' };
		async.waterfall([
			(next) => {
				devices.get(deviceId)
					.then((dev) => next(null, dev))
					.catch((err) => next(err));
			},
			(dev, next) => {
				Object.assign(vd, {
					device: dev,
					DeviceTypes: _.map(devices.types, (value, key) => {
						return {
							Name: key,
							Value: value,
							Selected: dev.type === value
						};
					}),
					Outlets: _.map(gpio.outlets, (outlet) => {
						return {
							Value: outlet.id,
							Selected: dev.outletId === outlet.id
						};
					})
				});
				next(null, dev);
			},
			(dev, next) => {
				let sensors = [];
				async.map(gpio.sensors, (s, callback) => {
					gpio.readSensor(s.pin)
						.catch((err) => {
							sensors.push(s);
							callback();
						})
						.then((sd) => {
							sensors.push(Object.assign({}, s, sd));
							callback();
						});
				},
				(err, rr) => {
					if (err){
						console.log(err);
						return next(err);
					}
					_.map(sensors, (s) => {
						return Object.assign(s, {
							Value: s.pin,
							Selected: dev.sensorId === s.pin
						});
					});
					Object.assign(vd, { Sensors: sensors });
					return next(null, rr);
				});
			}
		],
		(err) => {
			if (err){
				console.error(err);
				return res.status(500).send(err);
			}
			return res.render('device/action', vd);
		});
	});

	router.post('/addagenda/:id', (req, res) => {
		var deviceId = req.params.id;
		if (!deviceId)
			return res.status(500).send({ error: 'Invalid device ID' });
		else if (!req.body.timeString || !req.body.agendaName)
			return res.status(500).send({ error: '"timeString" and "agendaName" must both be truthy' });

		devices.addAgenda(deviceId, req.body.agendaName, req.body.timeString)
			.catch((err) => {
				console.error(err);
				res.status(500).send(err);
			})
			.then((newDeviceAgenda) => {
				res.send(newDeviceAgenda);
			});
	});

	router.post('/deleteagenda/:agendaId', (req, res) => {
		var agendaId = req.params.agendaId;
		if (!agendaId)
			return res.sendStatus(500);

		devices.deleteAgenda(agendaId)
			.catch((err) => {
				console.error('ERROR', err);
				res.status(500).send({ message: 'An error occurred while attempting to delete the agenda', error: err });
			})
			.then(() => res.sendStatus(200));
	});

	router.get('/details/:id', (req, res) => {
		var deviceId = req.params.id;
		if (!deviceId)
			return res.status(500).redirect('/device/list');

		devices.get(deviceId, true).then((dev) => {
			let device = dev.dataValues;
			if (device.outletId){
				Object.assign(device, {
					ledClass: gpio.getOutlet(dev.outletId).on ? 'green' : 'red'
				});
			}
			let jobs = [
				{ value: 'toggleDevice', text: 'Interval' }
			];
			res.render('device/details', {
				AllAgendaJobs: jobs,
				Device: device
			});
		}).catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.get('/list', (req, res) => {
		let vd = {};
		async.waterfall([
			(next) => {
				devices.getAll()
					.catch((err) => next(err))
					.then((devs) => next(null, devs));
			},
			(devs, next) => {
				let ds = [];
				async.map(devs, (d, callback) => {
					let rv = {};
					if (d.sensorId && d.sensorId !== -1){
						gpio.readSensor(d.sensorId)
							.catch((e) => callback(e))
							.then((sd) => {
								Object.assign(rv, d.dataValues, sd);
								ds.push(rv);
								callback();
							});
					}
					else if (d.outletId && d.outletId !== -1){
						Object.assign(rv, d.dataValues, {
							ledClass: gpio.getOutlet(d.outletId).on ? 'green' : 'red'
						});
						ds.push(rv);
						callback();
					}
				},
				(err, rs) => {
					if (err)
						return next(err);
					let sortedDevs = _.sortBy(ds, 'type');
					Object.assign(vd, { devices: sortedDevs });
					return next();
				});
			}
		],
		(err, results) => {
			if (err){
				console.error(err);
				return res.status(500).send(err);
			}
			return res.render('device/list', vd);
		});
	});

	router.post('/delete', (req, res) => {
		var deviceId = req.body.deviceId;
		if (!deviceId)
			return res.sendStatus(500, { error: 'invalid deviceId' });

		devices.delete(deviceId)
			.then(() => res.sendStatus(200))
			.catch((err) => {
				console.error(err);
				res.status(500).send(err);
			});
	});

	router.post('/toggle', (req, res) => {
		var deviceId = req.body.deviceId;
		if (!deviceId)
			return res.status(500).redirect('/device/list');

		devices.toggleDevice(deviceId)
			.then(() => res.sendStatus(200))
			.catch((err) => res.status(500).send({
				success: false,
				message: 'Unable to toggle device',
				error: err
			}));
	});

	router.post('/pause', (req, res) => {
		let deviceId = req.body.deviceId;
		if (!deviceId)
			return res.sendStatus(500);

		devices.pauseDevice(deviceId)
			.catch((err) => {
				console.error(err);
				res.status(500).send(err);
			})
			.then(() => res.sendStatus(200));
	});

	router.post('/unpause', (req, res) => {
		let deviceId = req.body.deviceId;
		if (!deviceId)
			return res.sendStatus(500);

		devices.unpauseDevice(deviceId)
			.catch((err) => {
				console.error(err);
				res.status(500).send(err);
			})
			.then(() => res.sendStatus(200));
	});

	let io,
		events = require('../lib/events');

	events.emitter.on('socketsStarted', () => {
		io = server.io.of('/device');
	});

	events.emitter.on('outletOn', (data) => {
		io.emit('deviceOn', data);
	});

	events.emitter.on('outletOff', (data) => {
		io.emit('deviceOff', data);
	});

	return router;
};
