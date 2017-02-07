let _ = require('underscore');

let filters = {
	take: (collection = [], numToTake = 1) => _.first(collection, numToTake),
	skip: (collection = [], numToSkip = 1) => collection.slice(-1 * (collection.length - numToSkip)),
	not: (item) => !item,
	upper: (text = '') => text.toUpperCase(),
	capfirst: (text = '') => text.toString().charAt(0).toUpperCase() + text.toString().substr(1),
	onoff: (val) => {
		if (!val)
			return 'off';
		return 'on';
	}
};

module.exports = filters;
