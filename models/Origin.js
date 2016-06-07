const keystone = require('keystone');
const Types = keystone.Field.Types;
const { SuperPromise } = require('../utils/tools');

const Origin = new keystone.List('Origin', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Origin.add({
	name: { type: String, required: true, index: true },
	lat: { type: Number, required: true, default: 0 },
	lng: { type: Number, required: true, default: 0 },
	vertical: { type: Types.Select, label: 'Vertical alignment', options: 'top, bottom', default: 'bottom' },
	horizontal: { type: Types.Select, label: 'Horizontal alignment', options: 'left, center, right', default: 'center' },
});

Origin.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Origin.model
		.find({}, 'key name lat lng vertical horizontal')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Origin.defaultColumns = 'name, lat, lng';
Origin.register();
