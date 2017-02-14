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
				let data = job.attrs.data;
				devices.forceOn(data.deviceId)
					.catch((err) => done(err))
					.then(() => {
						if (!data.repeating)
							return done();

						data.when = date(data.when, '1 day');
						console.log(`Rescheduling '${data.agendaJobName}' job for device ${data.deviceId} at '${data.when}'`);
						scheduler.scheduleTask(data)
							.catch((err) => done(err))
							.then(() => done());
					});
			},
			deviceOff: (job, done) => {
				let data = job.attrs.data;
				devices.forceOff(job.attrs.data.deviceId)
					.catch((err) => done(err))
					.then(() => {
						if (!data.repeating)
							return done();

						data.when = date(data.when, '1 day');
						console.log(`Rescheduling '${data.agendaJobName}' job for device ${data.deviceId} at '${data.when}'`);
						scheduler.scheduleTask(data)
							.catch((err) => done(err))
							.then(() => done());
					});
			},
			deviceOnSunrise: (job, done) => {
				let data = job.attrs.data;
				devices.forceOn(data.deviceId)
					.catch((err) => done(err))
					.then(() => {
						if (!data.repeating)
							return done();

						console.log(`Rescheduling '${data.agendaJobName}' job for device ${data.deviceId} at '${data.when}'`);
						scheduler.scheduleTask(data)
							.catch((err) => done(err))
							.then(() => done());
					});
			},
			deviceOffSunset: (job, done) => {
				let data = job.attrs.data;
				devices.forceOff(data.deviceId)
					.catch((err) => done(err))
					.then(() => {
						if (!data.repeating)
							return done();

						console.log(`Rescheduling '${data.agendaJobName}' job for device ${data.deviceId} at '${data.when}'`);
						scheduler.scheduleTask(data)
							.catch((err) => done(err))
							.then(() => done());
					});
			}
		};

		_.each(scheduler.jobs, (job, name) => scheduler.agenda.define(name, job));
	},

	scheduleTask: (when, jobName, data, repeating, repeatInterval) => {
		if (!_.isString(when) && !_.isDate(when) && _.isObject(when)){
			data = when;
			jobName = data.agendaJobName;
			repeating = data.repeating;
			repeatInterval = data.repeatInterval;
			when = data.when;
		}

		if (!when || !jobName)
			return new Promise((resolve, reject) => reject('Invalid when or jobName'));

		Object.assign(data, {
			when: when,
			repeating: repeating || false
		});

		let job = scheduler.agenda.create(jobName, data);
		let execTime = when;

		if (/(at ?)?sunrise/i.test(when)){
			execTime = scheduler.calcNextSunrise(data.offset);
			repeating = false;
		}
		else if (/(at ?)?sunset/i.test(when)){
			execTime = scheduler.calcNextSunset(data.offset);
			repeating = false;
		}

		if (repeating && repeatInterval && repeatInterval >= 0){
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

	bindEvents: () => {
		scheduler.agenda.on('ready', scheduler.agendaReady);
		scheduler.agenda.on('error', scheduler.agendaError);
	},

	agendaReady: () => {
		async.series([
			(next) => {
				scheduler.defineJobs();
				next();
			}
		],
		(err, results) => {
			if (err)
				return console.error('UNABLE TO START AGENDA', err);
			scheduler.agenda.start();
		});

	},

	agendaError: (error) => console.log('AGENDA ERROR', error),

	// This was initially being used to cancel certain jobs on shutdown but it isn't used anymore...
	// BUT, I didn't want to remove it because it could be useful in the future and it's already implemented
	halt: (cb) => cb(),

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
