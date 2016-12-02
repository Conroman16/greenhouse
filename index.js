if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

console.log(`${process.env.NODE_ENV.toUpperCase()} MODE`);

var db = require('./db'),
	server = require('./lib/server'),
	weather = require('./lib/weather');

weather.init();

db.sequelize.sync().then(() => {
	server.start();
});
