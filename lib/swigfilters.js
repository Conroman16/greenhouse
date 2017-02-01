let _ = require('underscore');

let filters = {
	take: (collection, numToTake) => _.first(collection, numToTake || 1),
	skip: (collection, numToSkip) => {
		return collection.slice(-1 * (collection.length - numToSkip));
	},
	not: (item) => !item,
	upper: (text) => (text || '').toUpperCase(),
	capfirst: (text) => text.toString().charAt(0).toUpperCase() + text.toString().substr(1)
};

module.exports = filters;
