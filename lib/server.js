var path = require('path'),
	http = require('http'),
	socket = require('socket.io'),
	express = require('express'),
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	swig = require('swig-templates'),
	sass = require('node-sass-middleware'),
	config = require('../lib/config'),
	passport = require('passport'),
	db = require('../db'),
	auth = require('./auth'),
	session = require('express-session'),
	events = require('../lib/events');

var server = {

	sockets: {
		start: () => {
			server.io = socket.listen(server.httpServer);
			events.emit('socketsStarted');
		}
	},

	start: () => {
		var app = express(),
			api = require('../routes/api')(),
			index = require('../routes/webindex')(),
			login = require('../routes/auth')(),
			status = require('../routes/status')(),
			outlets = require('../routes/outlets')(),
			sqliteStore = require('connect-sqlite3')(session),
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
			debug: config.logLibSassOutput
		}));

		app.use(bodyparser.urlencoded({ extended: true }));
		app.use(cookieparser());

		app.use(session({
			store: new sqliteStore,
			secret: config.sessionSecret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
			}
		}));

		app.use(passport.initialize());
		app.use(passport.session());

		app.use('/', index);
		app.use('/api', api);
		app.use('/auth', login);
		app.use('/status', status);
		app.use('/outlets', outlets);
		app.use('/static', express.static(staticFilesDir));

		server.app = app;
		server.httpServer = http.createServer(app).listen(config.webPort, () => {
			events.emit(`webserverStarted:${config.webPort}`);
			console.log(`Listening on *:${config.webPort}`);
		});

		server.sockets.start();
	}
};

module.exports = server;
