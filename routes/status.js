var router = require('express').Router();
var config = require('../lib/config');
var viewData = require('../lib/viewdata');
var weather = require('../lib/weather');
var moment = require('moment');
var sunFormat = 'h:mm a';

var formatDate = (date, format) => {
	return moment(date).format(format);
};

module.exports = () => {

	router.get('/', (req, res) => {
		if (req.isUnauthenticated())
			return res.redirect(config.loginPath);

		res.render('status', viewData({
			Temperature: 72,
			Humidity: '42%',
			Sunrise: formatDate(weather.sunrise, sunFormat),
			Sunset: formatDate(weather.sunset, sunFormat),
			// NextWeatherUpdate: weather.nextUpdate
		}));
	});

	return router;
};
