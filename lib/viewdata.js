var config = require('./config');

module.exports = {
	IsProd: config.isProd,
	IsDev: config.isDev,
	GoogleAnalyticsID: 'UA-xxxxxxxx-x',
	PageTitle: 'Greenhouse',
	LoginPath: config.loginPath,
	LogoutPath: config.logoutPath,
	RegisterPath: config.registerPath
};
