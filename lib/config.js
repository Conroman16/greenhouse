var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8888,
	saltRounds: 8,
	loginPath: '/auth/login',
	registerPath: '/auth/register',
	sessionSecret: 's0M3th!ng_v3rY_Z3cr3t',
	logLibSassOutput: false
};

module.exports = config;
