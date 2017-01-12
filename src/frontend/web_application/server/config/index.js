const { View, createEngine } = require('../express-react');
const { default: Login } = require('../auth/components/Login');
const makeConfig = require('../cfg');

module.exports = (app) => {
  const config = makeConfig(app.get('env'));
  app.set('coConfig', config);

  app.set('view', View);
  app.set('view engine', 'component');
  app.engine('component', createEngine({
    'login.component': Login,
  }));

  app.use((req, res, next) => {
    req.config = config;
    next();
  });
};
