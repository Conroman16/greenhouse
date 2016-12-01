var router = require('express').Router();
var passport = require('passport');
var db = require('../db');
var config = require('../lib/config');
var auth = require('../lib/auth');
var viewData = require('../lib/viewdata');

module.exports = () => {

	router.get('/logout', (req, res) => {
		if (req.isAuthenticated())
			req.logout();
		res.redirect(config.loginPath);
	});

	router.get('/login', (req, res) => {
		if (req.isAuthenticated())
			res.redirect('/');
		else
			res.render('login', viewData());
	});

	router.post('/login', (req, res, next) => {
		passport.authenticate('local', (err, user) => {
			if (err && /of null/i)
				return res.redirect(config.registerPath + '?from=login');
			else if (!user)
				return res.redirect(config.loginPath + '?status=failed');

			req.logIn(user, (err) => {
				if (err)
					return next(err);
				return res.redirect('/');
			});
		})(req, res, next);
	});

	router.get('/register', (req, res) => {
		if (req.isAuthenticated())
			res.redirect('/');
		else
			res.render('register', viewData());
	});

	router.post('/register', (req, res) => {
		var firstName = req.body.firstname || '';
		var lastName = req.body.lastname || '';
		var username = req.body.username || '';
		var password = req.body.password || '';

		if (!username)
			res.status(500).send({success: false, error: 'invalid username'});
		else if (!password)
			res.status(500).send({success: false, error: 'invalid password'});
		else
			auth.createUser(username, password, firstName, lastName).then((newUser) => {
				res.status(200).redirect('/');
			}).catch((err) => {
				res.status(500).send(err);
			});
	});

	return router;
};
