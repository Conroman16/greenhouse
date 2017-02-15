let _ = require('underscore');

let filters = {
	take: (collection = [], numToTake = 1) => _.first(collection, numToTake),
	skip: (collection = [], numToSkip = 1) => collection.slice(-1 * (collection.length - numToSkip)),
	not: (item) => !item,
	upper: (text = '') => text.toUpperCase(),
	capfirst: (text = '') => text.toString().charAt(0).toUpperCase() + text.toString().substr(1),
	percent: (val) => val ? `${val}%` : undefined,
	tempf: (val) => val ? `${val} °F` : undefined,
	tempc: (val) => val ? `${val} °C` : undefined,
	onoff: (val) => val ? 'on' : 'off',
	notempty: (val) => typeof(val) === 'object' && Object.keys(val).length
};

module.exports = filters;
