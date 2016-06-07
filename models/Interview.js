const keystone = require('keystone');
const Types = keystone.Field.Types;
const { SuperPromise } = require('../utils/tools');

function definedIfOtherField(thisField, otherField, otherValue) {
	return function() {
		return this[otherField] === otherValue ? this[thisField] : undefined;
	}
};

const Interview = new keystone.List('Interview', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Interview.add({
	name: { type: String, required: true, index: true },
	parent: { type: Types.Select, label: 'Parent type', options: 'location, egg' },
	originId: { type: Types.Relationship, ref: 'Origin', label: 'Origin', dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('originId', 'parent', 'location') },
	destinationId: { type: Types.Relationship, ref: 'Destination', label: 'Destination', dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('destinationId', 'parent', 'location') },
	eggId: { type: Types.Relationship, ref: 'Egg', label: 'Egg', dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('eggId', 'parent', 'egg') },
	lat: { type: Number, default: 0, dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('lat', 'parent', 'location') },
	lng: { type: Number, default: 0, dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('lng', 'parent', 'location') },
	top: { type: Number, default: 0, dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('top', 'parent', 'egg') },
	left: { type: Number, default: 0, dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('left', 'parent', 'egg') },
	sound: { type: String, default: '', label: 'Sound file name' },
});

Interview.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Interview.model
		.find({}, 'key name parent originId destinationId eggId lat lng top left sound')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Interview.defaultColumns = 'name, key, parent, originId, destinationId';
Interview.register();
