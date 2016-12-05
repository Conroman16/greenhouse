var router = require('express').Router();
var viewData = require('../lib/viewdata');
var config = require('../lib/config');
var server = require('../lib/server');
var events = require('../lib/events');
var gpio = require('../lib/gpio');
var _ = require('underscore');

module.exports = () => {

	router.get('/', (req, res) => {
		if (req.isUnauthenticated())
			return res.status(401).redirect(config.loginPath);

		res.render('outlets', viewData({
			outlets: _.map(gpio.outlets, (outlet) => {
				return {
					OutletID: outlet.id,
					TurnedON: outlet.on.toString()
				};
			})
		}));
	});

	router.post('/', (req, res) => {
		if (req.isUnauthenticated())
			return res.sendStatus(401);

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
		server.io.of('/outlets').on('connection', (socket) => {
			console.log('Socket connected to /outlets');
		});
	});

	events.on('outletOn', (data) => {
		server.io.of('/outlets').emit('outletOn', data);
	});

	events.on('outletOff', (data) => {
		server.io.of('/outlets').emit('outletOff', data);
	});

	return router;
};
