let _ = require('underscore');
let devices = require('./device');
let Agenda = require('agenda');
let config = require('./config');
let db = require('../db');
let async = require('async');
let weather = require('./weather');
let moment = require('moment');
let date = require('date.js');
let events = require('./events');

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
			},
			deviceOnSunrise: (job, done) => {
				devices.forceOn(job.attrs.data.deviceId)
					.catch((err) => done(err))
					.then(() => done());
			},
			deviceOffSunset: (job, done) => {
				devices.forceOff(job.attrs.data.deviceId)
					.catch((err) => done(err))
					.then(() => done());
			}
		};

		_.each(scheduler.jobs, (job, name) => {
			scheduler.agenda.define(name, job);
		});
	},

	scheduleTask: (when, jobName, data, repeating, repeatInterval) => {
		if (!when || !jobName)
			return new Promise((resolve, reject) => reject('Invalid when or jobName'));

		Object.assign(data, {
			when: when,
			repeating: repeating
		});

		let job = scheduler.agenda.create(jobName, data);
		let execTime = when;

		if (/(at ?)?sunrise/i.test(when)){
			execTime = scheduler.calcNextSunrise(data.offset);
		}
		else if (/(at ?)?sunset/i.test(when)){
			execTime = scheduler.calcNextSunrise(data.offset);
		}

		if (repeating && !repeatInterval){
			job.repeatAt(execTime);
		}
		else if (repeating && repeatInterval >= 0){
			job.attrs.data.repeatInterval = repeatInterval;
			job.repeatEvery(repeatInterval);
		}
		else{
			if (execTime instanceof Date)
				job.attrs.data.execTime = execTime.toJSON();
			job.schedule(execTime);
		}

		return new Promise((resolve, reject) => {
			job.save((err) => {
				if (err){
					console.error(err);
					return reject(err);
				}
				return resolve();
			});
		});
	},

	calcNextSunrise: (offsetMs) => {
		let sunrise = moment(weather.sunrise).add(offsetMs, 'ms');
		if (moment() > sunrise)
			sunrise.add(1, 'day');
		return new Date(sunrise.toJSON());
	},

	calcNextSunset: (offsetMs) => {
		let sunset = moment(weather.sunset).add(offsetMs, 'ms');
		if (moment() > sunset)
			sunset.add(1, 'day');
		return new Date(sunset.toJSON());
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
