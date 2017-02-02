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
				devices.toggleDevice(job.attrs.data.deviceId)
					.catch((err) => done(err))
					.then(() => done());
			},
			deviceOn: (job, done) => {
				devices.forceOn(job.attrs.data.deviceId)
					.catch((err) => done(err))
					.then(() => done());
			},
			deviceOff: (job, done) => {
				devices.forceOff(job.attrs.data.deviceId)
					.catch((err) => done(err))
					.then(() => done());
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
					db.DeviceAgenda.findAll({ where: { agendaJobName: 'toggleDevice' }})
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

	addDeviceJob: (jobName, timeString, data) => {
		data = Object.assign({}, data, {
			deviceId: data.deviceId
		});
		return new Promise((resolve, reject) => {
			let da = scheduler.agenda.create(jobName, data);
			da.repeatEvery(timeString).save((err) => {
				if (err){
					console.log(err);
					return reject(err);
				}
				return resolve();
			});
		});
	},

	cancelDeviceJob: (jobName, deviceAgendaId) => {
		return new Promise((resolve, reject) => {
			scheduler.agenda.jobs({
				name: jobName
			}, (err, jobs) => {
				if (err)
					return console.error(err);
				let jobsToRemove = _.filter(jobs, (j) => j.attrs.data.id == deviceAgendaId);
				async.each(jobsToRemove, (j, callback) => {
					j.remove((err) => {
						if (err)
							return callback(err);
						return callback();
					});
				}, (err) => {
					if (err){
						console.error(err);
						return reject(err);
					}
					return resolve();
				});
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

	scheduleTask: (timeString, jobName, data) => {
		return new Promise((resolve, reject) => {
			scheduler.agenda.schedule(timeString, jobName, data, (err) => {
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
