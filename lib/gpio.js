var config = require('./config');
var sensor = require('node-dht-sensor');
var rpigpio = require('rpi-gpio');
var moment = require('moment');
var _ = require('underscore');
let async = require('async');
const DHT22 = 22;
let events;

var gpio = {

	sensors: [],
	outlets: [],

	readSensor: (type, pin) => {
		return new Promise((resolve, reject) => {
			sensor.read(type, pin, (err, temperature, humidity) => {
				if (err)
					reject(err);
				else
					resolve({
						temperature: temperature,
						humidity: humidity
					});
			});
		});
	},

	readDht: () => {
		for (var i in config.dht){
			var s = config.dht[i];
			gpio.sensors.push(s);
		}
	},

	readOutlets: () => {
		for (var i in config.outlets){
			var outlet = config.outlets[i];
			gpio.outlets.push(outlet);
		}
	},

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

	getOutlet: (id) => {
		return _.findWhere(gpio.outlets, { id: JSON.parse(id) });
	},

	outletOn: (id) => {
		return new Promise((resolve, reject) => {
			var outlet = gpio.getOutlet(id);
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
			var outlet = gpio.getOutlet(id);
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
		var outlet = gpio.getOutlet(id);
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
				gpio.readDht();
				next();
			},
			(next) => {
				gpio.readOutlets();
				next();
			},
			(next) => {
				gpio.setupOutletPins(next);
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
