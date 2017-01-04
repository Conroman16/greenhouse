var router = require('express').Router();
var config = require('../lib/config');
var server = require('../lib/server');
var events = require('../lib/events');
var gpio = require('../lib/gpio');
var _ = require('underscore');

module.exports = () => {

	var io;

	router.get('/', (req, res) => {
		res.render('outlets', {
			outlets: _.map(gpio.outlets, (outlet) => {
				return {
					OutletID: outlet.id,
					LedClass: !!outlet.on ? 'green' : 'red'
				};
			})
		});
	});

	router.post('/', (req, res) => {
		var outletId = req.body.outletId;
		if (!outletId)
			return res.status(500).send({
				success: false,
				error: 'invalid outlet id'
			});

		gpio.toggleOutlet(outletId);
		res.status(200).send({ success: true, message: 'outlet toggled successfully' });
	});

	events.on('socketsStarted', () => {
		io = server.io.of('/outlets');
	});

	events.on('outletOn', (data) => {
		io.emit('outletOn', data);
	});

	events.on('outletOff', (data) => {
		io.emit('outletOff', data);
	});

	return router;
};
