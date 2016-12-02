if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

console.log(`${process.env.NODE_ENV.toUpperCase()} MODE`);

var gpio = require('./lib/gpio'),
	db = require('./db'),
	server = require('./lib/server'),
	weather = require('./lib/weather'),
	util = require('./lib/util');

gpio.init();
weather.init();

db.sequelize.sync().then(() => {
	server.start();
});
