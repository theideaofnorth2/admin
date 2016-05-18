const keystone = require('keystone');
const Types = keystone.Field.Types;
const SuperPromise = require('../utils/tools');

const City = new keystone.List('City', {
	autokey: { from: 'name', path: 'key', unique: true },
});

City.add({
	name: { type: String, required: true, index: true },
	lat: { type: Number, required: true, default: 0 },
	lng: { type: Number, required: true, default: 0 },
	vertical: { type: Types.Select, label: 'Vertical alignment', options: 'top, middle, bottom', default: 'bottom' },
	horizontal: { type: Types.Select, label: 'Horizontal alignment', options: 'left, center, right', default: 'center' },
});

City.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	City.model
		.find({}, 'key name lat lng vertical horizontal')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

City.defaultColumns = 'name, lat, lng';
City.register();
