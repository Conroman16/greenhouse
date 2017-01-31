var router = require('express').Router();
var childProcess = require('child_process');
let gpio = require('../lib/gpio')

function execCommand(command, cb){
	return childProcess.exec(command, cb);
}

module.exports = () => {

	router.get('/', (req, res) => res.render('index/index'));

	router.get('/th/:pin', (req, res) => {
		let p = JSON.parse(req.params.pin);
		gpio.readSensor(p)
			.catch((err) => res.status(500).send(err))
			.then((data) => res.send(data));
	});

	router.get('/allth', (req, res) => {
		gpio.readAllSensors()
			.catch((err) => res.status(500).send(err))
			.then((sensorData) => res.send(sensorData));
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
