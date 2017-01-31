var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var config = require('./config');
let scheduler = require('./scheduler');
let async = require('async');
let gpio = require('./gpio');

var events = {

	emitter: { default: 'value' },

	exitEvents: ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK', 'PROCERR'],

	init: (cb) => {
		if (!cb) cb = () => {};
		events.emitter = new EventEmitter();
		events.registerErrorHandler();
		events.registerExitEvents();
		cb();
	},

	processExit: function(event){
		console.log(`\n${event} received.  Exiting...`);
		async.series([
			(next) => {
				if (gpio.isInitialized)
					gpio.dispose(() => next());
				else
					next();
			},
			(next) => {
				scheduler.halt(next);
				setTimeout(() => next(), 1000 * 10);
			}
		],
		(err, results) => {
			process.exit();
		});
	},

	registerErrorHandler: () => {
		process.on('uncaughtException', (err) => {
			console.log(err.stack ? err.stack : err);
			if (config.isDev)
				process.emit('PROCERR');
		});
	},

	registerExitEvents: function(){
		_.each(events.exitEvents, (event) => {
			process.on(event, () => {
				events.processExit(event);
			});
		});
	}
};

module.exports = events;
