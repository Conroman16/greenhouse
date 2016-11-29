if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

console.log(`${process.env.NODE_ENV.toUpperCase()} MODE`);

var config = {
	isDev: process.env.NODE_ENV === 'development',
	isProd: process.env.NODE_ENV === 'production',
	webPort: 8888
};

module.exports = config;
