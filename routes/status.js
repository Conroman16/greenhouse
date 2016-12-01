var router = require('express').Router();
var config = require('../lib/config');
var viewData = require('../lib/viewdata');

module.exports = () => {

	router.get('/', (req, res) => {
		if (req.isUnauthenticated())
			return res.redirect(config.loginPath);

		res.render('status', viewData({
			Temperature: 72,
			Humidity: '42%'
		}));
	});

	return router;
};
