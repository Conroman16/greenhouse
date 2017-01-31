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
				}
			}),
			Outlets: _.map(gpio.outlets, (outlet) => {
				return {
					Value: outlet.id
				};
			})
		});
	});

	router.post('/create', (req, res) => {
		let outletId = req.body.outletId;
		let deviceType = req.body.deviceType;
		let deviceName = req.body.deviceName;
		let deviceDescription = req.body.deviceDescription;
		let defaultSetting = !!JSON.parse(req.body.defaultSetting);
		let isPaused = req.body.isPaused;

		if (!outletId || !deviceType || !deviceName)
			return res.sendStatus(500);

		devices.createDevice(outletId, deviceType, deviceName, deviceDescription, defaultSetting)
		.then((device) => {
			res.redirect('/device/list');
		}).catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.post('/edit', (req, res) => {
		let deviceId = req.body.deviceId;
		let outletId = req.body.outletId;
		let deviceType = req.body.deviceType;
		let deviceName = req.body.deviceName;
		let deviceDescription = req.body.deviceDescription;
		let defaultSetting = !!JSON.parse(req.body.defaultSetting);
		let isPaused = req.body.isPaused;

		if (!deviceId || deviceId == -1 || !outletId || !deviceType || !deviceName)
			return res.sendStatus(500);

		devices.update({
			id: deviceId,
			outletId: outletId,
			type: deviceType,
			name: deviceName,
			description: deviceDescription,
			defaultSetting: defaultSetting,
			isPaused: isPaused
		}).then((updatedDevice) => {
			res.sendStatus(200);
		}).catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.get('/edit/:id', (req, res) => {
		var deviceId = req.params.id;
		if (!deviceId)
			return res.status(500).redirect('/device/list');

		devices.get(deviceId).then((dev) => {
			res.render('device/action', {
				action: 'edit',
				device: dev,
				DeviceTypes: _.map(devices.types, (value, key) => {
					return {
						Name: key,
						Value: value,
						Selected: dev.type === value
					}
				}),
				Outlets: _.map(gpio.outlets, (outlet) => {
					return {
						Value: outlet.id,
						Selected: dev.outletId === outlet.id
					}
				})
			});
		})
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
				res.status(500)
					.send({ message: 'An error occurred while attempting to delete the agenda', error: err });
			})
			.then(() => {
				res.sendStatus(200);
			});
	});

	router.get('/details/:id', (req, res) => {
		var deviceId = req.params.id;
		if (!deviceId)
			return res.status(500).redirect('/device/list');

		devices.get(deviceId, true).then((dev) => {
			var device = _.extend({}, dev.dataValues, {
				ledClass: gpio.getOutlet(dev.outletId).on ? 'green' : 'red'
			});
			// let jobs = Object.keys(scheduler.jobs);
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
		devices.getAll().then((devs) => {
			res.render('device/list', {
				devices: _.map(devs, (d) => {
					return _.extend({}, d.dataValues, { ledClass: gpio.getOutlet(d.outletId).on ? 'green' : 'red' });
				})
			});
		}).catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.post('/delete', (req, res) => {
		var deviceId = req.body.deviceId;
		if (!deviceId)
			return res.sendStatus(500, { error: 'invalid deviceId' });

		devices.delete(deviceId)
			.then(() => res.sendStatus(200))
			.catch((err) => res.sendStatus(500, err));
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
