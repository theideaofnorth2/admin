const keystone = require('keystone');
const { uploadConfig } = require('./ftp');

exports.init = app => {
  const Origin = keystone.list('Origin');
  const Destination = keystone.list('Destination');
  const Egg = keystone.list('Egg');
  const Interview = keystone.list('Interview');
  const Guide = keystone.list('Guide');
  const Page = keystone.list('Page');

  const apiOrigins = (req, res, next) => {
    Origin.model.getAll(req, res, next).then(origins => {
      res.apiResponse(origins);
    });
  };
  const apiDestinations = (req, res, next) => {
    Destination.model.getAll(req, res, next).then(destinations => {
      res.apiResponse(destinations);
    });
  };
  const apiEggs = (req, res, next) => {
    Egg.model.getAll(req, res, next).then(eggs => {
      res.apiResponse(eggs);
    });
  };
  const apiInterviews = (req, res, next) => {
    Interview.model.getAll(req, res, next).then(interviews => {
      res.apiResponse(interviews);
    });
  };
  const apiGuides = (req, res, next) => {
    Guide.model.getAll(req, res, next).then(guides => {
      res.apiResponse(guides);
    });
  };
  const apiPages = (req, res, next) => {
    Page.model.getAll(req, res, next).then(pages => {
      res.apiResponse(pages);
    });
  };
  const apiConfig = (req, res, next) => {
    saveConfig().then(() => {
      res.send('Config uploaded to server');
    });
  };
  const saveConfig = (req, res, next) => {
    const originPromise = Origin.model.getAll(req, res, next);
    const destinationPromise = Destination.model.getAll(req, res, next);
    const eggPromise = Egg.model.getAll(req, res, next);
    const interviewPromise = Interview.model.getAll(req, res, next);
    const guidePromise = Guide.model.getAll(req, res, next);
    const pagePromise = Page.model.getAll(req, res, next);
    return Promise.all([
      originPromise,
      destinationPromise,
      eggPromise,
      interviewPromise,
      guidePromise,
      pagePromise,
    ]).then(results => {
      const config = {
        origins: results[0],
        destinations: results[1],
        eggs: results[2],
        interviews: results[3],
        guides: results[4],
        pages: results[5],
      };
      return uploadConfig(config);
    });
  };

  app.get('/api*', keystone.middleware.api, keystone.middleware.cors);
  app.get('/api/pages', apiPages);
  app.get('/api/guides', apiGuides);
  app.get('/api/interviews', apiInterviews);
  app.get('/api/origins', apiOrigins);
  app.get('/api/destinations', apiDestinations);
  app.get('/api/eggs', apiEggs);
  app.get('/api/config', apiConfig);

  /*
    Disables automatic upload of config to address
    performance issues met on first show using the light mode
  */
  // [Origin, Destination, Egg, Interview, Guide, Page].forEach(Model =>
  // 	Model.schema.post('save', () => saveConfig()));
};
