if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

console.log(`${process.env.NODE_ENV.toUpperCase()} MODE`);

let async = require('async');
let events = require('./lib/events');
let gpio = require('./lib/gpio');
let db = require('./db');
let server = require('./lib/server');
let scheduler = require('./lib/scheduler');
let device = require('./lib/device');

// Suppress bluebird warnings because I couldn't give a fuck about them and they make my logs hard to read
let bluebird = require('bluebird').config({ warnings: false });

setTimeout(() => {
	async.series([
		(next) => {
			events.init();
			next();
		},
		(next) => {
			gpio.init(next);
		},
		(next) => {
			db.sequelize.sync()
				.catch((err) => next(err))
				.then(() => next());
		},
		(next) => {
			device.init()
				.catch((err) => next(err))
				.then(() => next());
		},
		(next) => {
			scheduler.init();
			next();
		},
		(next) => {
			require('./lib/weather').init();
			next();
		},
		(next) => {
			server.start();
			next();
		}
	],
	(err, results) => {
		if (err)
			console.error('There were errors during startup');
	});
});
