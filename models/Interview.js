const keystone = require('keystone');
const Types = keystone.Field.Types;
const SuperPromise = require('../utils/tools');

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
	origin: { type: Types.Relationship, ref: 'Citie', dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('origin', 'parent', 'location') },
	destination: { type: Types.Relationship, ref: 'Citie', dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('destination', 'parent', 'location') },
	egg: { type: Types.Relationship, ref: 'Egg', dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('egg', 'parent', 'egg') },
	lat: { type: Number, default: 0, dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('lat', 'parent', 'location') },
	lng: { type: Number, default: 0, dependsOn: { parent: 'location' },
		watch: true, value: definedIfOtherField('lng', 'parent', 'location') },
	top: { type: Number, default: 0, dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('top', 'parent', 'egg') },
	left: { type: Number, default: 0, dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('left', 'parent', 'egg') },
});

Interview.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Interview.model
		.find({}, 'key name parent origin destination egg lat lng top left')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Interview.defaultColumns = 'name, parent';
Interview.register();
