let config = require('./config');
let weather = require('./weather');

let viewData = {
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

viewData.middleware = (req, res, next) => {
	res.locals = Object.assign({}, res.locals, {
		IsAuthed: req.isAuthenticated(),
		IsNotAuthed: req.isUnauthenticated()
	});
	next();
};

module.exports = viewData;
