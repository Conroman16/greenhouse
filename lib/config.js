var env = require('../.env');
const DHT22 = 22;

var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8000,
	saltRounds: 8,
	loginPath: '/auth/login',
	logoutPath: '/auth/logout',
	registerPath: '/auth/register',
	logLibSassOutput: false,
	dht: [
		{ pin: 17, type: DHT22 }
	]
};

Object.assign(config, env);

module.exports = config;
