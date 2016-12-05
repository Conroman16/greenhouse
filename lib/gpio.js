var config = require('./config');
var sensor = require('node-dht-sensor');
var rpigpio = require('rpi-gpio');
var events = require('./events');
var _ = require('underscore');
const DHT22 = 22;

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

	setupOutletPins: () => {
		_.each(gpio.outlets, (outlet) => {
			rpigpio.setup(outlet.pin, rpigpio.DIR_OUT, rpigpio.EDGE_NONE, (err) => {
				if (err) throw err;
				outlet.on = false;
				outlet.exported = true;
				gpio.writePin(outlet.pin, false);
			});
		});
	},

	writePin: (pin, value, cb) => {
		value = JSON.parse(value);
		rpigpio.write(pin, !value, cb);
	},

	getOutlet: (id) => {
		return _.findWhere(gpio.outlets, { id: JSON.parse(id) });
	},

	outletOn: (id) => {
		var outlet = gpio.getOutlet(id);
		gpio.writePin(outlet.pin, 1, (err) => {
			outlet.on = true;
			if (err)
				console.log(`Error attempting to turn outlet ${outlet.id} on`);
			else{
				events.emit('outletOn', { id: outlet.id });
				console.log(`Outlet ${outlet.id} turned on`);
			}
		});
	},

	outletOff: (id) => {
		var outlet = gpio.getOutlet(id);
		gpio.writePin(outlet.pin, 0, (err) => {
			outlet.on = false;
			if (err)
				console.log(`Error attempting to turn outlet ${outlet.id} off`);
			else{
				events.emit('outletOff', { id: outlet.id });
				console.log(`Outlet ${outlet.id} turned off`);
			}
		});
	},

	toggleOutlet: (id) => {
		var outlet = gpio.getOutlet(id);
		if (outlet.on)
			gpio.outletOff(id);
		else
			gpio.outletOn(id);
	},

	dispose: (cb) => {
		rpigpio.destroy(cb);
	},

	init: () => {
		gpio.readDht();
		gpio.readOutlets();
		gpio.setupOutletPins();

		gpio.isInitialized = true;
	}
};

module.exports = gpio;
