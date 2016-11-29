var router = require('express').Router();
var config = require('../lib/config');

module.exports = () => {

	router.get('/', (req, res) => {
		res.render('index', {
			IsProd: config.isProd,
			GoogleAnalyticsID: 'UA-xxxxxxxx-x',
			PageTitle: 'Greenhouse'
		});
	});

	return router;
};
