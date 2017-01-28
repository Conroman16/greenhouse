var _ = require('underscore');
let async = require('async');
var db = require('../db');
let scheduler = {};
let gpio = {};

var device = {

	types: {
		Light: 'light',
		DHT22: 'dht22',
		Fan: 'fan',
		Heater: 'heater'
	},

	createDevice: (outletId, type, name, description, defaultSetting) => {
		if (!defaultSetting){
			return db.Device.create({
				outletId: outletId,
				type: type,
				name: name,
				description: description,
				defaultSetting: !!defaultSetting
			});
		}
		else{
			return new Promise((resolve, reject) => {
				db.Device.create({
					outletId: outletId,
					type: type,
					name: name,
					description: description,
					defaultSetting: !!defaultSetting
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				})
				.then((newDevice) => {
					gpio.toggleOutlet(newDevice.outletId)
						.catch((err) => reject(err))
						.then(() => resolve(newDevice));
				});
			});
		}
	},

	getAll: (includeAgendas) => {
		var includes = [];
		if (includeAgendas)
			includes.push(db.DeviceAgenda);

		return db.Device.findAll({ include: includes });
	},

	get: (deviceId, includeAgendas) => {
		var includes = [];
		if (includeAgendas)
			includes.push(db.DeviceAgenda);

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

		return new Promise((resolve, reject) => {
			device.forceOff(d)
			.catch((err) => reject(err))
			.then(() => {
				db.Device.destroy({ where: { id: d }})
					.catch((err) => reject(err))
					.then((data) => resolve(data));
			});
		});
	},

	addAgenda: (deviceId, agendaName, timeString) => {
		if (!_.isNumber(deviceId))
			deviceId = JSON.parse(deviceId);
		return new Promise((resolve, reject) => {
			db.DeviceAgenda.create({
				deviceId: deviceId,
				agendaJobName: agendaName,
				timeString: timeString
			})
			.catch((err) => reject(err))
			.then((newAgenda) => {
				scheduler.addDeviceJob(agendaName, deviceId, timeString)
					.catch((err) => {
						console.error(err);
						reject(err);
					})
					.then((device) => {
						resolve();
					});
			});
		});
	},

	deleteAgenda: (agendaId) => {
		return new Promise((resolve, reject) => {
			if (!agendaId)
				return reject({ error: 'invalid agenda id' });

			async.waterfall([
				// Retrieve job to be modified from Sequelize DB
				(next) => {
					db.DeviceAgenda.findOne({ where: { id: JSON.parse(agendaId || '-1') } })
						.catch((err) => {
							next(err);
						})
						.then((job) => {
							next(null, job);
						});
				},
				// Cancel associated jobs in Agenda DB
				(job, next) => {
					scheduler.cancelDeviceJob(job.agendaJobName, job.deviceId)
					.catch((err) => {
						console.error(err);
						next(err);
					})
					.then(() => {
						next(null, job);
					});
				},
				// Destroy job in Sequelize DB
				(job, next) => {
					db.DeviceAgenda.destroy({ where: { id: agendaId }})
						.catch((err) => next(err))
						.then(() => next());
				}
			],
			(err, results) => {
				if (err){
					console.error(err);
					return reject(err);
				}
				return resolve(results);
			});
		});
	},

	forceOff: (id) => {
		return new Promise((resolve, reject) => {
			db.Device
				.findOne({ where: { id: id }})
				.then((device) => {
					gpio.outletOff(device.outletId)
						.catch((err) => reject(err))
						.then(() => resolve());
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	},

	toggleDevice: (id) => {
		return new Promise((resolve, reject) => {
			db.Device
				.findOne({ where: { id: id }})
				.then((device) => {
					gpio.toggleOutlet(device.outletId)
						.catch((err) => reject(err))
						.then(() => resolve());
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	},

	init: () => {
		scheduler = require('./scheduler');
		gpio = require('./gpio');

		return new Promise((resolve, reject) => {
			db.Device.findAll({ where: { defaultSetting: true } })
				.catch((err) => {
					console.error(err);
					return reject(err);
				})
				.then((devices) => {
					async.map(devices, (d, callback) => {
						device.toggleDevice(d.id)
							.catch((err) => {
								console.error(err);
								callback(err);
							})
							.then(() => callback());
					},
					(err, results) => resolve());
				});
		});
	}
};

module.exports = device;
