const keystone = require('keystone');
const SuperPromise = require('../utils/tools');

exports.init = (app) => {

	const City = keystone.list('City');
	const Interview = keystone.list('Interview');

	const apiCities = (req, res, next) => {
		City.model.getAll(req, res, next).then((cities) => {
			res.apiResponse(cities);
		});
	}
	const apiInterviews = (req, res, next) => {
		Interview.model.getAll(req, res, next).then((interviews) => {
			res.apiResponse(interviews);
		});
	}
	const apiConfig = (req, res, next) => {
		const cityPromise = City.model.getAll(req, res, next);
		const interviewPromise = Interview.model.getAll(req, res, next);
		Promise.all([cityPromise, interviewPromise]).then(results => {
			res.apiResponse({ cities: results[0], interviews: results[1] });
		})
	}

	app.get('/api*', keystone.middleware.api, keystone.middleware.cors);
	app.get('/api/interviews', apiInterviews);
	app.get('/api/cities', apiCities);
	app.get('/api/config', apiConfig);

}
