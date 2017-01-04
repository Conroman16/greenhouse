var router = require('express').Router();
var config = require('../lib/config');
var childProcess = require('child_process');
var util = require('../lib/util');

function execCommand(command, cb){
	return childProcess.exec(command, cb);
}

module.exports = () => {

	router.get('/', (req, res) => {
		res.render('index/index');
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
