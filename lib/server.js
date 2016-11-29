var path = require('path'),
	http = require('http'),
	express = require('express'),
	bodyparser = require('body-parser'),
	swig = require('swig-templates'),
	sass = require('node-sass-middleware'),
	config = require('../lib/config');

var server = {
	start: () => {
		var app = express(),
			api = require('../routes/api')(),
			index = require('../routes/webindex')(),
			staticFilesDir = path.resolve('./static'),
			viewsDir = path.resolve('./views');

		app.engine('swig', swig.renderFile);
		app.set('view engine', 'swig');
		app.set('views', viewsDir);

		app.use(sass({
			src: path.join(staticFilesDir, 'style'),
			dest: path.join(staticFilesDir, 'css'),
			outputStyle: config.isDev ? 'expanded' : 'compressed',
			prefix: '/static/css',
			debug: config.isDev
		}));

		app.use(bodyparser.json());
		app.use(bodyparser.urlencoded({extended: true}));

		app.use('/', index);
		app.use('/api', api);
		app.use('/static', express.static(staticFilesDir));

		http.createServer(app).listen(config.webPort, () => {
			console.log(`Listening on *:${config.webPort}`);
		});
	}
};

module.exports = server;
