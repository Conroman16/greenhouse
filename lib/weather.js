var config = require('./config');
var moment = require('moment');
var RestClient = require('node-rest-client').Client;
var client = new RestClient();

var weather = {
	astronomyApiUrl: `https://api.wunderground.com/api/${config.wundergroundApiKey}/astronomy/q/${config.zipCode}.json`,

	cache: {
		astronomy: {}
	},

	get sunrise () {
		var d = new Date();
		var sunriseRaw = weather.cache.astronomy.sun_phase.sunrise;
		var sunrise = new Date(d.getYear(), d.getMonth(), d.getDay(), sunriseRaw.hour, sunriseRaw.minute);
		return sunrise;
	},

	get sunset () {
		var d = new Date();
		var sunsetRaw = weather.cache.astronomy.sun_phase.sunset;
		var sunset = new Date(d.getYear(), d.getMonth(), d.getDay(), sunsetRaw.hour, sunsetRaw.minute);
		return sunset;
	},

	update: () => {
		client.get(weather.astronomyApiUrl, (data) => {
			weather.cache.astronomy = data;
		});
	},

	init: () => {
		weather.update();
		var midnight = moment().add(1, 'days').hour(0).minute(0).second(1);

		// Update at midnight, then start updating every 24 hours
		setTimeout(() => {
			weather.update();
			setInterval(() => {
				weather.update();
			}, 1000 * 60 * 60 * 24);
		}, midnight - moment());
	}
};

module.exports = weather;
