const dotenv = require('dotenv');
const express = require('express');
const keystone = require('keystone');

if (process.env.NODE_ENV !== 'production') dotenv.config();

const api = require('./api');
const config = require('./config');
const app = express();

keystone.init(config.options);
keystone.import('./models');

keystone.set('locals', config.locals);
keystone.set('nav', config.nav);

keystone.initExpressSession();

app.use('/keystone', keystone.Admin.Server.createStaticRouter(keystone));

app.use(keystone.get('session options').cookieParser);
app.use(keystone.expressSession);
app.use(keystone.session.persist);
app.use(require('connect-flash')());

app.use('/keystone', keystone.Admin.Server.createDynamicRouter(keystone));

keystone.openDatabaseConnection(() => {
	const server = app.listen(process.env.PORT || 8080, () => {
		console.log(`
-------------------------------
Express server ready on port ${server.address().port}
-------------------------------
		`);
	});
});

api.init(app);
