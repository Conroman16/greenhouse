let config = require('./config');
let dhtSensor = require('node-dht-sensor');
let rpigpio = require('rpi-gpio');
let moment = require('moment');
let _ = require('underscore');
let async = require('async');
let util = require('./util');
const DHT22 = 22;
const SPECIFICITY = 2;
let events;

let gpio = {

	sensors: [],
	outlets: [],

	readSensor: (pin, celsius) => {
		return new Promise((resolve, reject) => {
			let s = _.findWhere(gpio.sensors, { pin: pin });
			if (!s)
				return reject('There is not a sensor attached to the spacified pin');
			else
				type = s.type;

			dhtSensor.read(type, pin, (err, temperature, humidity) => {
				if (err)
					return reject(err);
				else {
					let temp = celsius ? temperature : util.convert.cToF(temperature);
					temp = JSON.parse(temp.toFixed(SPECIFICITY));
					let humid = JSON.parse(humidity.toFixed(SPECIFICITY));
					return resolve({
						temperature: temp,
						humidity: humid
					});
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
		return new Promise((resolve, reject) => {
			let outlet = gpio.getOutlet(id);
			gpio.writePin(outlet.pin, 1, (err) => {
				outlet.on = true;
				if (err){
					console.log(`Error attempting to turn outlet ${outlet.id} on`);
					return reject(err);
				}
				else{
					events.emitter.emit('outletOn', { id: outlet.id });
					console.log(`Outlet ${outlet.id} turned on`);
					return resolve();
				}
			});
		});
	},

	outletOff: (id) => {
		return new Promise((resolve, reject) => {
			let outlet = gpio.getOutlet(id);
			gpio.writePin(outlet.pin, 0, (err) => {
				outlet.on = false;
				if (err){
					console.log(`Error attempting to turn outlet ${outlet.id} off`);
					return reject(err);
				}
				else{
					events.emitter.emit('outletOff', { id: outlet.id });
					console.log(`Outlet ${outlet.id} turned off`);
					return resolve();
				}
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
