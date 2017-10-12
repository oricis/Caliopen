const createEngine = require('./create-engine');
const View = require('./view');
const { default: ErrorComponent } = require('../error/components/Error');

module.exports = {
  createEngine,
  View,
  configure: (app) => {
    app.set('view', View);
    app.set('view engine', 'component');
    app.engine('component', createEngine({
      'error.component': ErrorComponent,
    }));
  },
};
