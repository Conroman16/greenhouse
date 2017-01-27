let _ = require('underscore');
let devices = require('./device');
let Agenda = require('agenda');
let config = require('./config');
let db = require('../db');
let async = require('async');

let scheduler = {

	dbName: `mongodb://${config.mongoAddress}/agenda`,

	defineJobs: () => {
		scheduler.jobs = {
			toggleDevice: (job, done) => {
				devices.toggleDevice(job.attrs.data.deviceId);
				done();
			}
		};

		_.each(scheduler.jobs, (job, name) => {
			scheduler.agenda.define(name, job);
		});
	},

	configureJobs: () => {
		return new Promise((resolve, reject) => {
			db.DeviceAgenda.findAll()
				.catch((err) => console.error(err))
				.then((agendas) => {
					if (!agendas || agendas.length === 0){
						console.log('There are no device agendas');
						return resolve();
					}

					_.each(agendas, (agenda) => {
						let da = scheduler.agenda.create('toggleDevice', { deviceId: agenda.deviceId });
						da.repeatEvery(agenda.timeString).save();

						// MUSINGS ON HOW IT MIGHT BE POSSIBLE TO LOCATE AND UPDATE THESE JOBS WITHOUT RESETTING THEM ALL
						// console.log(da);
						// scheduler.agenda.jobs({ name: 'toggleDevice', data: { deviceId: 2 } }, (err, jobs) => {
						// 	if (err)
						// 		return console.error(err);
						// 	console.log('HI', jobs);
						// });
					});

					resolve();
				});
		});
	},

	cancelDeviceAgendaJobs: () => {
		return new Promise((resolve, reject) => {
			scheduler.agenda.cancel({ name: 'toggleDevice' }, (err, numRemoved) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
	},

	bindEvents: () => {
		scheduler.agenda.on('ready', scheduler.agendaReady);
		scheduler.agenda.on('error', scheduler.agendaError);
	},

	agendaReady: () => {
		async.series([
			(next) => {
				scheduler.defineJobs();
				next();
			},
			(next) => {
				scheduler.configureJobs()
					.catch((err) => next(err))
					.then(() => next());
			}
		],
		(err, results) => {
			if (err)
				return console.error('UNABLE TO START AGENDA', err);
			scheduler.agenda.start();
		});

	},

	agendaError: (error) => console.log('AGENDA ERROR', error),

	halt: (cb) => {
		scheduler.cancelDeviceAgendaJobs()
			.catch((err) => cb())
			.then(() => scheduler.agenda.stop(() => cb()));
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
