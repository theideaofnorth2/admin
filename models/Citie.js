const keystone = require('keystone');
const Types = keystone.Field.Types;
const SuperPromise = require('../utils/tools');

const Citie = new keystone.List('Citie', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Citie.add({
	name: { type: String, required: true, index: true },
	lat: { type: Number, required: true, default: 0 },
	lng: { type: Number, required: true, default: 0 },
	vertical: { type: Types.Select, label: 'Vertical alignment', options: 'top, bottom', default: 'bottom' },
	horizontal: { type: Types.Select, label: 'Horizontal alignment', options: 'left, center, right', default: 'center' },
});

Citie.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Citie.model
		.find({}, 'key name lat lng vertical horizontal')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Citie.defaultColumns = 'name, lat, lng';
Citie.register();
