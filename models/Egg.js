const keystone = require('keystone');
const Types = keystone.Field.Types;
const { SuperPromise } = require('../utils/tools');

const Egg = new keystone.List('Egg', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Egg.add({
	name: { type: String, required: true, index: true },
	originId: { type: Types.Relationship, ref: 'Origin', label: 'Origin' },
	lat: { type: Number, default: 0 },
	lng: { type: Number, default: 0 },
	image: { type: String, default: '', label: 'Icon image file name' },
	video: { type: String, default: '', label: 'Background video file name' },
});

Egg.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Egg.model
		.find({}, 'key name originId lat lng image video')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Egg.defaultColumns = 'name, originId';
Egg.register();
