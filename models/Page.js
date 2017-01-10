const keystone = require('keystone');
const Types = keystone.Field.Types;
const { SuperPromise } = require('../utils/tools');

const Page = new keystone.List('Page', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Page.add({
	name: { type: String, required: true, index: true },
	en: { type: Types.Html, wysiwyg: true, label: 'English version' },
	fr: { type: Types.Html, wysiwyg: true, label: 'French version' },
});

Page.schema.statics.getAll = () => {
	const superPromise = SuperPromise();
	Page.model
		.find({}, 'key name en fr')
		.exec()
		.then(superPromise.resolve);
	return superPromise.promise;
};

Page.defaultColumns = 'name';
Page.register();
