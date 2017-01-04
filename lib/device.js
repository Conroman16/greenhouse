var _ = require('underscore');
var db = require('../db');
var gpio = require('./gpio');

var device = {

	types: {
		Light: 'light',
		DHT22: 'dht22',
		Fan: 'fan',
		Heater: 'heater'
	},

	createDevice: (outletId, type, name, description) => {
		return db.Device.create({
			outletId: outletId,
			type: type,
			name: name,
			description: description
		});
	},

	getAll: (includeIntervals) => {
		var includes = [];
		if (includeIntervals)
			includes.push(db.DeviceInterval);

		return db.Device.findAll({ include: includes });
	},

	get: (deviceId, includeIntervals) => {
		var includes = [];
		if (includeIntervals)
			includes.push(db.DeviceInterval);

		return db.Device.findOne({ where: { id: deviceId }, include: includes });
	},

	update: (d) => {
		if (!d || !d.id || d.id == -1)
			return new Promise((resolve, reject) => reject({ error: 'invalid device id' }));
		return db.Device.update(d, { where: { id: d.id }});
	},

	delete: (d) => {
		if (!d)
			return new Promise((resolve, reject) => reject({ error: 'invalid device id' }));
		else if (_.isObject(d) && d.id)
			d = d.id;
		return db.Device.destroy({ where: { id: d }});
	},

	toggleDevice: (id) => {
		db.Device
			.findOne({ where: { id: id }})
			.then((device) => gpio.toggleOutlet(device.outletId))
			.catch((err) => console.error(err));
	}
};

module.exports = device;
