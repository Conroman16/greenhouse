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
			async.waterfall([
				(next) => {
					db.DeviceAgenda.findAll()
						.catch((err) => console.error(err))
						.then((agendas) => {
							if (!agendas || agendas.length === 0)
								return next(null, []);
							return next(null, agendas);
						});
				},
				(agendas, next) => {
					async.map(agendas, (agenda, callback) => {
						let da = scheduler.agenda.create('toggleDevice', { deviceId: agenda.deviceId });
						da.repeatEvery(agenda.timeString).save((err) => {
							if (err){
								console.error(err);
								return callback(err);
							}
							return callback();
						});
					},
					(err, results) => {
						if (err){
							console.error(err);
							return next(err);
						}
						next();
					});
				}
			],
			(err, results) => {
				if (err){
					console.error(err);
					return reject(err);
				}
				return resolve(results);
			});
		});
	},

	addDeviceJob: (jobName, deviceId, timeString) => {
		return new Promise((resolve, reject) => {
			let da = scheduler.agenda.create(jobName, { deviceId: deviceId });
			da.repeatEvery(timeString).save((err) => {
				if (err){
					console.log(err);
					return reject(err);
				}
				return resolve();
			});
		});
	},

	cancelDeviceJob: (jobName, deviceId) => {
		return new Promise((resolve, reject) => {
			scheduler.agenda.cancel({
				name: jobName,
				data: {
					deviceId: deviceId
				}
			},
			(err, numRemoved) => {
				if (err){
					console.error(err);
					return reject(err);
				}
				return resolve(numRemoved);
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

	scheduleDeviceTask: (timeString, jobName, data) => {
		return new Promise((resolve, reject) => {
			scheduler.agenda.schedule(timeString, name, data, (err) => {
				if (err){
					console.error(err);
					return reject(err);
				}
				return resolve();
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

	init: (cb) => {
		if (!cb) cb = () => {};
		scheduler.agenda = new Agenda({
			defaultConcurrency: config.outlets.length,
			db: {
				address: scheduler.dbName
			}
		});

		scheduler.bindEvents();
		cb();
	}
};

module.exports = scheduler;
