const keystone = require('keystone');
const { uploadConfig } = require('./ftp');

exports.init = (app) => {

	const Citie = keystone.list('Citie');
	const Egg = keystone.list('Egg');
	const Interview = keystone.list('Interview');

	const apiCities = (req, res, next) => {
		Citie.model.getAll(req, res, next).then((cities) => {
			res.apiResponse(cities);
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
	const apiConfig = (req, res, next) => {
		const citiePromise = Citie.model.getAll(req, res, next);
		const eggPromise = Egg.model.getAll(req, res, next);
		const interviewPromise = Interview.model.getAll(req, res, next);
		Promise.all([citiePromise, eggPromise, interviewPromise]).then(results => {
			const config = { cities: results[0], eggs: results[1], interviews: results[2] };
			uploadConfig(config).then(() => {
				res.apiResponse(config);
			})
		})
	}

	app.get('/api*', keystone.middleware.api, keystone.middleware.cors);
	app.get('/api/interviews', apiInterviews);
	app.get('/api/cities', apiCities);
	app.get('/api/eggs', apiEggs);
	app.get('/api/config', apiConfig);

}
