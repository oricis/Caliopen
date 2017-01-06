const bodyParser = require('body-parser');
const route = require('./route.js');

module.exports = (app) => {
  app.use('/auth', bodyParser.urlencoded({ extended: false }));
  app.use('/auth', route);
};
