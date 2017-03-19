let router = require('express').Router();
let childProcess = require('child_process');
let gpio = require('../lib/gpio');
let weather = require('../lib/weather');

function execCommand(command, cb){
	return childProcess.exec(command, cb);
}

module.exports = () => {

	router.get('/', (req, res) => res.render('index/index'));

	router.get('/astronomy', (req, res) => {
		res.send({
			sunrise: weather.sunrise,
			sunset: weather.sunset
		});
	});

	router.get('/cam', (req, res) => {
		res.render('index/cam', { url: config.webcamUrl });
	});

	router.get(/\/(shutdown|restart)+/i, (req, res) => {
		res.render('index/action', {
			action: req.params[0]
		});
	});

	router.post('/restart', (req, res) => {
		res.sendStatus(200);
		setTimeout(() => {
			execCommand('reboot');
		}, 500);
	});

	router.post('/shutdown', (req, res) => {
		res.sendStatus(200);
		setTimeout(() => {
			execCommand('shutdown -h now');
		}, 500);
	});

	return router;
};
