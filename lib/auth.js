var config = require('./config'),
	passport = require('passport'),
	bcrypt = require('bcrypt'),
	LocalStrategy = require('passport-local').Strategy,
	db = require('../db');

var auth ={

	hashPassword: (password) => {
		var promise = new Promise((resolve, reject) => {
			bcrypt.hash(password, config.saltRounds, (err, hash) => {
				if (err){
					reject(err);
					return;
				}
				resolve(hash);
			});
		});

		return promise;
	},

	verifyPassword: (user, password) => {
		var promise = new Promise((resolve, reject) => {
			bcrypt.compare(password, user.hash, (err, success) => {
				if (err){
					reject(err);
					return;
				}

				success ? resolve(success) : reject(success);
			});
		});

		return promise;
	},

	loginUser: (username, password, done) => {
		db.User.findOne({ where: { username: username }}).then((user) => {
			auth.verifyPassword(user, password).then((success) => {
				if (!user)
					done(null, false, { message: 'unknown user' });
				else if (!success)
					done(null, false, { message: 'invalid password' });
				else {
					user.lastLogin = new Date();
					user.save();
					done(null, user);
				}
			}).catch((success) => {
				done(success);
			});
		}).catch((err) => {
			done(err);
		});
	},

	createUser: (username, password, firstName, lastName) => {
		var promise = new Promise((resolve, reject) => {
			auth.hashPassword(password).then((hash) => {
				db.User.create({
					username: username,
					hash: hash,
					firstName: firstName,
					lastName: lastName,
					created: new Date()
				}).then((newUser) => {
					resolve(newUser);
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			});
		});

		return promise;
	},

	init: () => {
		passport.use(new LocalStrategy(auth.loginUser));

		passport.serializeUser((user, done) => {
			done(null, user.username);
		});
		passport.deserializeUser((username, done) => {
			db.User.findOne({ where: { username: username }}).then((user) => {
				done(null, user);
			}).catch((err) => {
				done(err);
			});
		});
	}
};

auth.init();

module.exports = auth;
