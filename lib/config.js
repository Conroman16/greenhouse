var env = require('../.env');
const DHT22 = 22;

var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8888,
	saltRounds: 8,
	logLibSassOutput: false,
	logSqlOutput: false,
	serverHeader: 'gh',
	loginPath: '/auth/login',
	logoutPath: '/auth/logout',
	registerPath: '/auth/register',
	mongoAddress: '127.0.0.1:27017',
	pathsWithoutAuth: [],
	dht: [  // DHT11 / DHT22 / AM2302 sensor config
		{ pin: 26, type: DHT22 },
		{ pin: 16, type: DHT22 }
	],
	outlets: [
		{ id: 1, pin: 22, type: 110 },
		// { id: 2, pin: 18, type: 110 },  // Intermittent issues
		{ id: 3, pin: 16, type: 110 },
		// { id: 4, pin: 15, type: 110 },  // Doesn't toggle
		{ id: 5, pin: 13, type: 110 },
		{ id: 6, pin: 12, type: 110 },
		// { id: 7, pin: 11, type: 110 },  // Doesn't toggle
		{ id: 8, pin: 7, type: 110 },
		// { id: 9, pin: 31, type: 5 },
		// { id: 10, pin: 29, type: 5 }
	]
};

config.pathsWithoutAuth.push(config.loginPath);
config.pathsWithoutAuth.push(config.registerPath);

Object.assign(config, env);

module.exports = config;
