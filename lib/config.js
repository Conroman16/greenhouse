var env = require('../.env');

var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8888,
	saltRounds: 8,
	loginPath: '/auth/login',
	logoutPath: '/auth/logout',
	registerPath: '/auth/register',
	logLibSassOutput: false
};

Object.assign(config, env);

module.exports = config;
