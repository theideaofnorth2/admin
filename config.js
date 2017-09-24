exports.options = {
  name: 'The Idea Of North 2.0',
  brand: 'The Idea Of North 2.0',
  favicon: 'static/favicon.ico',
  'auto update': true,
  session: true,
  auth: true,
  'cors allow origin': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET,
  mongo: `mongodb://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process
    .env.DB_URL}`,
};
exports.locals = {
  env: process.NODE_ENV,
};

exports.nav = {
  origins: ['origins'],
  destinations: ['destinations'],
  eggs: ['eggs'],
  interviews: ['interviews'],
  guides: ['guides'],
  pages: ['pages'],
};
