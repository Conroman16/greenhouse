var router = require('express').Router();
var config = require('../lib/config');
var viewData = require('../lib/viewdata');

module.exports = () => {

	router.get('/', (req, res) => {
		if (req.isUnauthenticated()) {
			res.redirect(config.loginPath);
			return;
		}

		res.render('index', viewData());
	});

	return router;
};
