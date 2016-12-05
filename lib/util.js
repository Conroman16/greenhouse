var moment = require('moment');

var util = {

	formatDate: (date, format) => {
		return moment(date).format(format);
	},

	convert: {
		cToF: (c) => util.convert.celsiusToFahrenheit(c),
		celsiusToFahrenheit: (c) => {
			return c * 9 / 5 + 32;
		},

		fToC: (f) => util.convert.fahrenheitToCelsius(f),
		fahrenheitToCelsius: (f) => {
			return (f - 32) * 5 / 9;
		}
	}
};

module.exports = util;