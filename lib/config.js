var env = require('../.env');
const DHT22 = 22;

var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8888,
	saltRounds: 8,
	logLibSassOutput: false,
	serverHeader: 'gh',
	loginPath: '/auth/login',
	logoutPath: '/auth/logout',
	registerPath: '/auth/register',
	mongoAddress: '127.0.0.1:27017',
	pathsWithoutAuth: [],
	dht: [  // DHT11 / DHT22 / AM2302 sensor config
		// { pin: 29, type: DHT22 }
	],
	outlets: [
		{ id: 1, pin: 22, desc: '' },
		{ id: 2, pin: 18, desc: '' },
		{ id: 3, pin: 16, desc: '' },
		// { id: 4, pin: 15, desc: '' },
		{ id: 5, pin: 13, desc: '' },
		{ id: 6, pin: 12, desc: '' },
		// { id: 7, pin: 11, desc: '' },
		{ id: 8, pin: 7, desc: '' }
	]
};

config.pathsWithoutAuth.push(config.loginPath);
config.pathsWithoutAuth.push(config.registerPath);

Object.assign(config, env);

module.exports = config;
