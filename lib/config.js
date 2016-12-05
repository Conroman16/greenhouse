var env = require('../.env');
const DHT22 = 22;

var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8888,
	saltRounds: 8,
	loginPath: '/auth/login',
	logoutPath: '/auth/logout',
	registerPath: '/auth/register',
	logLibSassOutput: false,
	dht: [  // DHT11 / DHT22 / AM2302 sensor config
		// { pin: 17, type: DHT22 }
	],
	outlets: [
		{ pin: 22, id: 1 },
		{ pin: 18, id: 2 },
		{ pin: 16, id: 3 },
		// { pin: 15, id: 4 },
		{ pin: 13, id: 5 },
		{ pin: 12, id: 6 },
		// { pin: 11, id: 7 },
		{ pin: 7, id: 8 }
	]
};

Object.assign(config, env);

module.exports = config;
