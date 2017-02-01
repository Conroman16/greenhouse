var config = require('./config');
let weather = require('./weather');

module.exports = {
	IsProd: config.isProd,
	IsDev: config.isDev,
	GoogleAnalyticsID: 'UA-xxxxxxxx-x',
	PageTitle: 'Greenhouse',
	LoginPath: config.loginPath,
	LogoutPath: config.logoutPath,
	RegisterPath: config.registerPath,
	Sunrise: weather.sunrise.toJSON(),
	Sunset: weather.sunset.toJSON()
};
