const keystone = require('keystone');
const Types = keystone.Field.Types;
const SuperPromise = require('../utils/tools');

const Interview = new keystone.List('Interview', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Interview.add({
	origin: { type: Types.Relationship, ref: 'City' },
	destination: { type: Types.Relationship, ref: 'City' },
	name: { type: String, required: true, index: true },
	lat: { type: Number, required: true, default: 0 },
	lng: { type: Number, required: true, default: 0 },
	vertical: { type: Types.Select, label: 'Vertical alignment', options: 'top, middle, bottom', default: 'bottom' },
	horizontal: { type: Types.Select, label: 'Horizontal alignment', options: 'left, center, right', default: 'center' },
});

Interview.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Interview.model
		.find({}, 'key name origin destination lat lng vertical horizontal')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Interview.defaultColumns = 'name, origin, destination';
Interview.register();
