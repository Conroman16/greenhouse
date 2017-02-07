let path = require('path'),
	http = require('http'),
	socket = require('socket.io'),
	express = require('express'),
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	swig = require('swig-templates'),
	sass = require('node-sass-middleware'),
	config = require('./config'),
	passport = require('passport'),
	db = require('../db'),
	auth = require('./auth'),
	session = require('express-session'),
	events = require('./events'),
	swigFilters = require('./swigfilters'),
	_ = require('underscore'),
	Agendash = require('agendash');

var server = {

	sockets: {
		start: () => {
			server.io = socket.listen(server.httpServer);
			events.emitter.emit('socketsStarted');
		}
	},

	serverHeaderMiddleware: (req, res, next) => {
		res.header('server', config.serverHeader);
		next();
	},

	start: (cb) => {
		if (!cb) cb = () => {};
		var app = express(),
			viewData = require('./viewdata'),
			index = require('../routes/webindex')(),
			login = require('../routes/auth')(),
			status = require('../routes/status')(),
			outlets = require('../routes/outlets')(),
			device = require('../routes/device')(),
			sqliteStore = require('connect-sqlite3')(session),
			staticFilesDir = path.resolve('./static'),
			viewsDir = path.resolve('./views'),
			scheduler = require('./scheduler');

		swig.setDefaults({
			cache: config.isDev ? false : 'memory',
			locals: viewData
		});
		_.each(swigFilters, (filterFunc, name) => swig.setFilter(name, filterFunc));

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
			store: new sqliteStore({
				db: config.isDev ? 'sessions.dev' : 'sessions'
			}),
			secret: config.sessionSecret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
			}
		}));

		app.use(passport.initialize());
		app.use(passport.session());
		app.use(auth.redirectMiddleware);
		app.use(server.serverHeaderMiddleware);
		app.use(viewData.middleware);

		app.use('/', index);
		app.use('/auth', login);
		app.use('/status', status);
		app.use('/outlets', outlets);
		app.use('/device', device);
		app.use('/static', express.static(staticFilesDir, {
			setHeaders: (res) => {
				res.header('server', config.serverHeader);
			}
		}));

		app.use('/agendash', Agendash(scheduler.agenda));

		server.app = app;
		server.httpServer = http.createServer(app).listen(config.webPort, () => {
			events.emitter.emit('webserverStarted', config.webPort);
			console.log(`Listening on *:${config.webPort}`);
		});

		server.sockets.start();

		cb();
	}
};

module.exports = server;
