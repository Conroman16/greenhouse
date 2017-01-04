var router = require('express').Router();
var config = require('../lib/config');
var weather = require('../lib/weather');
var gpio = require('../lib/gpio');
var util = require('../lib/util');
var sunFormat = 'h:mm a';

module.exports = () => {

	router.get('/', (req, res) => {
		gpio.readSensor(gpio.sensors[0].type, gpio.sensors[0].pin).then((data) => {
			var temp = Math.round(util.convert.cToF(data.temperature));
			var humid = Math.round(data.humidity);

			res.render('status', {
				Temperature: `${temp} °F`,
				Humidity: `${humid}%`,
				Sunrise: util.formatDate(weather.sunrise, sunFormat),
				Sunset: util.formatDate(weather.sunset, sunFormat),
				// NextWeatherUpdate: weather.nextUpdate
			});
		}).catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
	});

	return router;
};
