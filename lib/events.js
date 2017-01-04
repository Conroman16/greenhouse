var _ = require('underscore');
var config = require('./config');
var gpio = require('./gpio');
var event = require('events');

var emitter = new event.EventEmitter();

var events = _.extend(emitter, {

	exitEvents: ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK', 'PROCERR'],

	init: () => {
		events.registerErrorHandler();
		events.registerExitEvents();
	},

	processExit: function(event){
		console.log(`\n${event} received.  Exiting...`);

		if (gpio.isInitialized){
			gpio.dispose(() => {
				process.exit();
			});
		}
		else
			process.exit();
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
});

module.exports = events;