if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

console.log(`${process.env.NODE_ENV.toUpperCase()} MODE`);

var gpio = require('./lib/gpio'),
	db = require('./db'),
	server = require('./lib/server'),
	scheduler = require('./lib/scheduler'),
	weather = require('./lib/weather'),
	util = require('./lib/util'),
	events = require('./lib/events');

events.init();
gpio.init();
scheduler.init();
// weather.init();

db.sequelize.sync().then(() => {
	server.start();
});
