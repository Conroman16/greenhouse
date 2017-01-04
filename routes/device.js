var _ = require('underscore');
var router = require('express').Router();
var viewData = require('../lib/viewdata');
var config = require('../lib/config');
var server = require('../lib/server');
var events = require('../lib/events');
var gpio = require('../lib/gpio');
var devices = require('../lib/device');
var scheduler = require('../lib/scheduler');
var _ = require('underscore');

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
		var outletId = req.body.outletId || '';
		var deviceType = req.body.deviceType || '';
		var deviceName = req.body.deviceName || '';
		var deviceDescription = req.body.deviceDescription || '';

		if (!outletId || !deviceType || !deviceName)
			return res.sendStatus(500);

		devices.createDevice(outletId, deviceType, deviceName, deviceDescription).then((device) => {
			res.redirect('/device/list');
		}).catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.post('/edit', (req, res) => {
		var deviceId = req.body.deviceId;
		var outletId = req.body.outletId || '';
		var deviceType = req.body.deviceType || '';
		var deviceName = req.body.deviceName || '';
		var deviceDescription = req.body.deviceDescription || '';

		if (!deviceId || deviceId == -1 || !outletId || !deviceType || !deviceName)
			return res.sendStatus(500);

		devices.update({
			id: deviceId,
			outletId: outletId,
			type: deviceType,
			name: deviceName,
			description: deviceDescription
		}).then((updatedDevice) => {
			res.redirect(`/device/details/${deviceId}`);
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

	router.get('/details/:id', (req, res) => {
		var deviceId = req.params.id;
		if (!deviceId)
			return res.status(500).redirect('/device/list');

		// scheduler.addInterval(deviceId);

		devices.get(deviceId, true).then((dev) => {
			var device = _.extend({}, dev.dataValues, {
				ledClass: gpio.getOutlet(dev.outletId).on ? 'green' : 'red'
			});
			console.log(device);
			res.render('device/details', device);
		}).catch((err) => {
			res.sendStatus(500);
			console.error(err);
		});
	});

	router.get('/list', (req, res) => {
		devices.getAll().then((devs) => {
			res.render('device/list', {
				devices: _.sortBy(_.map(devs, (d) => {
					return _.extend({}, d.dataValues, { ledClass: gpio.getOutlet(d.outletId).on ? 'green' : 'red' });
				}), 'outletId')
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

	router.post('/list/toggle', (req, res) => {
		var deviceId = req.body.deviceId;
		if (!deviceId)
			return res.sendStatus(500);

		devices.toggleDevice(deviceId);
		res.sendStatus(200);
	});

	var io;

	events.on('socketsStarted', () => {
		io = server.io.of('/device');
	});

	events.on('outletOn', (data) => {
		io.emit('deviceOn', data);
	});

	events.on('outletOff', (data) => {
		io.emit('deviceOn', data);
	});

	return router;
};
