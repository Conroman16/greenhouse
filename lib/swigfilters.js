let _ = require('underscore');

let filters = {
	take: (collection, numToTake) => _.first(collection, numToTake || 1),
	skip: (collection, numToSkip) => {
		return collection.slice(-1 * (collection.length - numToSkip));
	}
};

module.exports = filters;
