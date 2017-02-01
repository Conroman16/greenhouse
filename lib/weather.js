var config = require('./config');
var moment = require('moment');
var RestClient = require('node-rest-client').Client;
var client = new RestClient();
let async = require('async');

var weather = {
	astronomyApiUrl: `https://api.wunderground.com/api/${config.wundergroundApiKey}/astronomy/q/${config.zipCode}.json`,

	cache: {
		astronomy: {}
	},

	get sunrise () {
		var d = new Date();
		var sunriseRaw = weather.cache.astronomy.sun_phase.sunrise;
		var sunrise = new Date(d.getFullYear(), d.getMonth(), d.getDate(), sunriseRaw.hour, sunriseRaw.minute);
		return sunrise;
	},

	get sunset () {
		var d = new Date();
		var sunsetRaw = weather.cache.astronomy.sun_phase.sunset;
		var sunset = new Date(d.getFullYear(), d.getMonth(), d.getDate(), sunsetRaw.hour, sunsetRaw.minute);
		return sunset;
	},

	update: (cb) => {
		if (!cb) cb = () => {};
		let req = client.get(weather.astronomyApiUrl, (data) => {
			weather.cache.astronomy = data;
			cb(null, data);
		});
		req.on('error', (err) => cb(err));
		req.on('requestTimeout', (req) => {
			req.abort();
			cb('Request timed out');
		});
		req.on('responseTimeout', (res) => cb('Response timed out'));
	},

	init: (cb) => {
		async.series([
			(next) => {
				weather.update(next);
			},
			(next) => {
				let midnight = moment().add(1, 'days').hour(0).minute(0).second(1);
				// Update at midnight, then start updating every 24 hours
				setTimeout(() => {
					weather.update();
					setInterval(() => {
						weather.update();
					}, 1000 * 60 * 60 * 24);
				}, midnight - moment());
				next();
			}
		],
		(err, results) => {
			if (err){
				console.error(err);
				return cb(err);
			}
			return cb(null, results);
		});
	}
};

module.exports = weather;
