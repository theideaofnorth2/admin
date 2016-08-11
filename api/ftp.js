const JSFtp = require('jsftp');
const { SuperPromise } = require('../utils/tools');

module.exports.uploadConfig = (config) => {
	const superPromise = SuperPromise();
	const myJsftp = new JSFtp({
		host: process.env.FTP_HOST,
		port: 21,
		user: process.env.FTP_USER,
		pass: process.env.FTP_PASS,
		debugMode: true,
	});
	const configJson = JSON.stringify(config);
	const buffer = new Buffer(configJson, 'binary');
	myJsftp.put(buffer, './config.json', (err) => {
		if (err) {
			console.error(err);
			superPromise.reject();
		} else {
			superPromise.resolve();
		}
	});
	return superPromise.promise;
};
