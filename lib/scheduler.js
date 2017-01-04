var _ = require('underscore');
var devices = require('./device');
var Agenda = require('agenda');
var config = require('./config');

var scheduler = {

	dbName: `mongodb://${config.mongoAddress}/agenda`,

	defineJobs: () => {
		scheduler.jobs = {
			'test-job': (job, done) => {
				console.log('Hi from \'test-job\'!');
				devices.getAll(true).then((devices) => {
					console.log(devices);
				}).catch((err) => {
					console.log('error getting devices');
				});
				done();
			}
		};

		_.each(scheduler.jobs, (job, name) => {
			scheduler.agenda.define(name, job);
		});
	},

	configureJobs: () => {
		scheduler.agenda.every('15 seconds', 'test-job');
	},

	bindEvents: () => {
		scheduler.agenda.on('ready', scheduler.agendaReady);
		scheduler.agenda.on('error', scheduler.agendaError);
	},

	agendaReady: () => {
		scheduler.defineJobs();
		scheduler.configureJobs();
		scheduler.agenda.start();
	},

	agendaError: (error) => {
		console.log('AGENDA ERROR', error);
	},

	init: () => {
		scheduler.agenda = new Agenda({
			defaultConcurrency: config.outlets.length,
			db: {
				address: scheduler.dbName
			}
		});

		scheduler.bindEvents();
	}
};

module.exports = scheduler;
