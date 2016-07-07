module.exports.SuperPromise = () => {
	const superPromise = {};
	superPromise.promise = new Promise((resolve, reject) => {
		Object.assign(superPromise, { resolve, reject });
	});
	return superPromise;
};

module.exports.definedIfOtherField = (thisField, otherField, otherValue) => {
	return function() {
		return this[otherField] === otherValue ? this[thisField] : undefined;
	}
};
