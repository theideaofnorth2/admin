const keystone = require('keystone');
const Types = keystone.Field.Types;
const { definedIfOtherField, SuperPromise } = require('../utils/tools');

const Interview = new keystone.List('Interview', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Interview.add({
	name: { type: String, required: true, index: true },
	originId: { type: Types.Relationship, ref: 'Origin', label: 'Origin' },
	destinationId: { type: Types.Relationship, ref: 'Destination', label: 'Destination' },
	sound: { type: String, default: '', label: 'Sound file name' },
	image: { type: String, default: '', label: 'Cover image file name' },
	parent: { type: Types.Select, label: 'Displayed in', options: 'origin, egg' },
	eggId: { type: Types.Relationship, ref: 'Egg', label: 'Egg', dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('eggId', 'parent', 'egg') },
	lat: { type: Number, default: 0, dependsOn: { parent: 'origin' },
		watch: true, value: definedIfOtherField('lat', 'parent', 'origin') },
	lng: { type: Number, default: 0, dependsOn: { parent: 'origin' },
		watch: true, value: definedIfOtherField('lng', 'parent', 'origin') },
	top: { type: Number, default: 0, label: 'Top (in %)', dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('top', 'parent', 'egg') },
	left: { type: Number, default: 0, label: 'Left (in %)', dependsOn: { parent: 'egg' },
		watch: true, value: definedIfOtherField('left', 'parent', 'egg') },
});

Interview.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Interview.model
		.find({}, 'key name originId destinationId sound image parent eggId lat lng top left')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Interview.defaultColumns = 'name, parent, originId, destinationId';
Interview.register();
