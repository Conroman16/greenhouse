var moment = require('moment');
var crypto = require('crypto');

var util = {

	formatDate: (date, format) => {
		return moment(date).format(format);
	},

	convert: {
		cToF: (c) => util.convert.celsiusToFahrenheit(c),
		celsiusToFahrenheit: (c) => c * 9 / 5 + 32,

		fToC: (f) => util.convert.fahrenheitToCelsius(f),
		fahrenheitToCelsius: (f) => (f - 32) * 5 / 9
	},
	random: {
		bytes: (numBytes) => {
			numBytes = JSON.parse(numBytes) || 64;
			return new Promise((resolve, reject) => {
				crypto.randomBytes(numBytes, (err, buffer) => {
					if (err)
						return reject(err);
					return buffer;
				});
			});
		},
		string: (numBytes, stringifier) => {
			// https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
			return new Promise((resolve, reject) => {
				util.random.bytes(numBytes).then((bytes) => {
					var str = bytes.toString(stringifier || 'base64');
					resolve(str);
				}).catch((err) => {
					resolve(err);
				});
			});
		}
	}
};

module.exports = util;
