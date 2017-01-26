const { View, createEngine } = require('../express-react');
const { default: Error } = require('../error/components/Error');
const makeConfig = require('../cfg');

module.exports = (app) => {
  const config = makeConfig(app.get('env'));
  app.set('coConfig', config);

  app.set('view', View);
  app.set('view engine', 'component');
  app.engine('component', createEngine({
    'error.component': Error,
  }, config));

  app.use((req, res, next) => {
    req.config = config;
    next();
  });
};
