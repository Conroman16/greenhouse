var config = require('./config');

module.exports = (o) => {

	var viewData = {
		IsProd: config.isProd,
		IsDev: config.isDev,
		GoogleAnalyticsID: 'UA-xxxxxxxx-x',
		PageTitle: 'Greenhouse',
		LoginPath: config.loginPath,
		LogoutPath: config.logoutPath,
		RegisterPath: config.registerPath
	};

	Object.assign(viewData, o);

	return viewData;
};
