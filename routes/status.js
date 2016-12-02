var router = require('express').Router();
var config = require('../lib/config');
var viewData = require('../lib/viewdata');
var weather = require('../lib/weather');
var gpio = require('../lib/gpio');
var util = require('../lib/util');
var moment = require('moment');
var sunFormat = 'h:mm a';

module.exports = () => {

	router.get('/', (req, res) => {
		if (req.isUnauthenticated())
			return res.redirect(config.loginPath);

		gpio.readSensor(gpio.sensors[0].type, gpio.sensors[0].pin).then((data) => {
			var temp = Math.round(util.convert.cToF(data.temperature));
			var humid = Math.round(data.humidity);

			res.render('status', viewData({
				Temperature: `${temp} °F`,
				Humidity: `${humid}%`,
				Sunrise: util.formatDate(weather.sunrise, sunFormat),
				Sunset: util.formatDate(weather.sunset, sunFormat),
				// NextWeatherUpdate: weather.nextUpdate
			}));
		}).catch((err) => {
			console.log(err);
		});
	});

	return router;
};
