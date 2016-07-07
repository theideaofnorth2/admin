const keystone = require('keystone');
const Types = keystone.Field.Types;
const { definedIfOtherField, SuperPromise } = require('../utils/tools');

const Storie = new keystone.List('Storie', {
	autokey: { from: 'view', path: 'key', unique: true },
	map: { name: 'view' },
	sortable: true,
});

Storie.add({
	view: { type: Types.Select, initial: true, required: true, label: 'View type', options: 'main, origin, egg, interview' },
	originId: { type: Types.Relationship, ref: 'Origin', label: 'Origin', dependsOn: { view: 'origin' },
		watch: true, value: definedIfOtherField('originId', 'view', 'origin') },
	eggId: { type: Types.Relationship, ref: 'Egg', label: 'Egg', dependsOn: { view: 'egg' },
		watch: true, value: definedIfOtherField('eggId', 'view', 'egg') },
	interviewId: { type: Types.Relationship, ref: 'Interview', label: 'Interview', dependsOn: { view: 'interview' },
		watch: true, value: definedIfOtherField('interviewId', 'view', 'interview') },
});

Storie.schema.statics.getAll = (req, res, next) => {
	const superPromise = SuperPromise();
	Storie.model
		.find({}, 'key view originId eggId interviewId sortOrder')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise
};

Storie.defaultColumns = 'view, originId, eggId, interviewId';
Storie.register();
