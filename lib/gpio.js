let config = require('./config');
let dhtSensor = require('node-dht-sensor');
let rpigpio = require('rpi-gpio');
let moment = require('moment');
let _ = require('underscore');
let async = require('async');
let util = require('./util');
let db = require('../db');
const DHT22 = 22;
const DECIMAL_SPECIFICITY = 2;
let events;

let gpio = {

	sensors: [],
	outlets: [],
	sensorCache: [],

	readSensor: (pin, celsius) => {
		return new Promise((resolve, reject) => {
			let s = _.findWhere(gpio.sensors, { pin: pin });
			let cacheData = _.findWhere(gpio.sensorCache, { sensorId: pin });
			if (!s)
				return reject('There is not a sensor attached to the spacified pin');
			else
				type = s.type;

			dhtSensor.read(type, pin, (err, temperature, humidity) => {
				if (err){
					if (cacheData)
						return resolve(cacheData);
					return reject(err);
				}
				else {
					let temp = celsius ? temperature : util.convert.cToF(temperature);
					temp = JSON.parse(temp.toFixed(DECIMAL_SPECIFICITY));
					let humid = JSON.parse(humidity.toFixed(DECIMAL_SPECIFICITY));
					let tempData = Object.assign(cacheData || {}, {
						sensorId: pin,
						temperature: temp,
						humidity: humid
					});
					gpio.sensorCache.push(tempData);
					return resolve(tempData);
				}
			});
		});
	},

	readAllSensors: () => {
		return new Promise((resolve, reject) => {
			let sensorData = [];
			async.each(gpio.sensors, (sensor, callback) => {
				gpio.readSensor(sensor.pin)
					.catch((err) => callback(err))
					.then((data) => {
						sensorData.push(Object.assign(data, sensor));
						callback();
					});
			},
			(err) => {
				if (err){
					console.error(err);
					return reject(err);
				}
				return resolve(sensorData);
			});
		});
	},

	readDhtConfig: () => _.each(config.dht, (s) => gpio.sensors.push(s)),

	readOutletConfig: () => _.each(config.outlets, (outlet) => gpio.outlets.push(outlet)),

	setupOutletPins: (cb) => {
		async.map(gpio.outlets, (outlet, next) => {
			rpigpio.setup(outlet.pin, rpigpio.DIR_OUT, rpigpio.EDGE_NONE, (err) => {
				if (err){
					console.error(err);
					callback(err);
				};
				outlet.on = false;
				outlet.exported = true;
				gpio.writePin(outlet.pin, false, () => next());
			});
		},
		(err, results) => cb());
	},

	writePin: (pin, value, cb) => {
		value = JSON.parse(value);
		rpigpio.write(pin, !value, cb);
	},

	getOutlet: (id) => _.findWhere(gpio.outlets, { id: JSON.parse(id) }),

	outletOn: (id) => {
		let isOn = true;
		return new Promise((resolve, reject) => {
			let outlet = gpio.getOutlet(id);
			async.waterfall([
				(next) => {
					gpio.writePin(outlet.pin, 1, (err) => {
						outlet.on = isOn;
						if (err){
							console.log(`Error attempting to turn outlet ${outlet.id} on`);
							next(err);
						}
						else{
							events.emitter.emit('outletOn', { id: outlet.id });
							console.log(`Outlet ${outlet.id} turned on`);
							next();
						}
					});
				},
				(next) => {
					db.Device.findOne({ where: { outletId: outlet.id }})
						.catch((err) => next(err))
						.then((d) => next(null, d));
				},
				(d, next) => {
					d.isOn = isOn;
					d.save()
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

	outletOff: (id) => {
		let isOn = false;
		return new Promise((resolve, reject) => {
			let outlet = gpio.getOutlet(id);
			async.waterfall([
				(next) => {
					gpio.writePin(outlet.pin, 0, (err) => {
						outlet.on = isOn;
						if (err){
							console.log(`Error attempting to turn outlet ${outlet.id} off`);
							next(err);
						}
						else{
							events.emitter.emit('outletOff', { id: outlet.id });
							console.log(`Outlet ${outlet.id} turned off`);
							next();
						}
					});
				},
				(next) => {
					db.Device.findOne({ where: { outletId: outlet.id }})
						.catch((err) => next(err))
						.then((d) => next(null, d));
				},
				(d, next) => {
					d.isOn = isOn;
					d.save()
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

	toggleOutlet: (id) => {
		let outlet = gpio.getOutlet(id);
		if (outlet.on)
			return gpio.outletOff(id);
		else
			return gpio.outletOn(id);
	},

	dispose: (cb) => {
		rpigpio.destroy(cb);
	},

	init: (cb) => {
		events = require('./events');
		async.series([
			(next) => {
				gpio.readOutletConfig();
				next();
			},
			(next) => {
				gpio.setupOutletPins(next);
			},
			(next) => {
				gpio.readDhtConfig();
				next();
			}
		],
		(err, results) => {
			gpio.isInitialized = true;
			if (cb)
				cb();
		});
	}
};

module.exports = gpio;
