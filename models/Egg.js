const keystone = require('keystone');
const Types = keystone.Field.Types;
const SuperPromise = require('../utils/tools');

const Egg = new keystone.List('Egg', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Egg.add({
	name: { type: String, required: true, index: true },
	origin: { type: Types.Relationship, ref: 'Citie' },
	top: { type: Number, default: 0, label: 'Top (in %)' },
	left: { type: Number, default: 0, label: 'Left (in %)' },
});

Egg.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Egg.model
		.find({}, 'key name origin top left')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Egg.defaultColumns = 'name, origin';
Egg.register();
