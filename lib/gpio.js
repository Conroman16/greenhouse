var config = require('./config');
var sensor = require('node-dht-sensor');
const DHT22 = 22;

var gpio = {

	sensors: [],

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

	init: () => {
		for(var i in config.dht){
			var s = config.dht[i];
			gpio.sensors.push(s);
		}
	}
};

module.exports = gpio;