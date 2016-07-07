const keystone = require('keystone');
const { uploadConfig } = require('./ftp');

exports.init = (app) => {

	const Origin = keystone.list('Origin');
	const Destination = keystone.list('Destination');
	const Egg = keystone.list('Egg');
	const Interview = keystone.list('Interview');
	const Storie = keystone.list('Storie');

	const apiOrigins = (req, res, next) => {
		Origin.model.getAll(req, res, next).then((origins) => {
			res.apiResponse(origins);
		});
	}
	const apiDestinations = (req, res, next) => {
		Destination.model.getAll(req, res, next).then((destinations) => {
			res.apiResponse(destinations);
		});
	}
	const apiEggs = (req, res, next) => {
		Egg.model.getAll(req, res, next).then((eggs) => {
			res.apiResponse(eggs);
		});
	}
	const apiInterviews = (req, res, next) => {
		Interview.model.getAll(req, res, next).then((interviews) => {
			res.apiResponse(interviews);
		});
	}
	const apiStories = (req, res, next) => {
		Storie.model.getAll(req, res, next).then((stories) => {
			res.apiResponse(stories);
		});
	}
	const apiConfig = (req, res, next) => {
		const originPromise = Origin.model.getAll(req, res, next);
		const destinationPromise = Destination.model.getAll(req, res, next);
		const eggPromise = Egg.model.getAll(req, res, next);
		const interviewPromise = Interview.model.getAll(req, res, next);
		const storiePromise = Storie.model.getAll(req, res, next);
		Promise.all([originPromise, destinationPromise, eggPromise, interviewPromise, storiePromise]).then(results => {
			const config = { origins: results[0], destinations: results[1], eggs: results[2], interviews: results[3], stories: results[4] };
			uploadConfig(config).then(() => {
				res.apiResponse(config);
			})
		})
	}

	app.get('/api*', keystone.middleware.api, keystone.middleware.cors);
	app.get('/api/stories', apiStories);
	app.get('/api/interviews', apiInterviews);
	app.get('/api/origins', apiOrigins);
	app.get('/api/destinations', apiDestinations);
	app.get('/api/eggs', apiEggs);
	app.get('/api/config', apiConfig);

}
