const keystone = require('keystone');
const Types = keystone.Field.Types;
const { SuperPromise } = require('../utils/tools');

const Destination = new keystone.List('Destination', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Destination.add({
	name: { type: String, required: true, index: true },
	lat: { type: Number, default: 0 },
	lng: { type: Number, default: 0 },
	image: { type: String, default: '', label: 'Cover image file name' },
	vertical: {
		type: Types.Select,
		label: 'Vertical alignment',
		options: 'top, bottom',
		default: 'top',
	},
	horizontal: {
		type: Types.Select,
		label: 'Horizontal alignment',
		options: 'left, center, right',
		default: 'center' },
});

Destination.schema.statics.getAll = () => {
	const superPromise = SuperPromise();
	Destination.model
		.find({}, 'key name lat lng image vertical horizontal')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise;
};

Destination.defaultColumns = 'name, lat, lng';
Destination.register();
