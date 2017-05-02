import { matchPath } from 'react-router-dom';
import { getApplications } from '../../services/application-manager';
import { switchApplication } from '../modules/application';

const routeActionHandler = ({ store, action }) => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return;
  }
  const { pathname } = action.payload;
  const application = getApplications()
    .find(app => matchPath(pathname, { path: app.route, exact: true }));

  if (application) {
    store.dispatch(switchApplication(application.name));
  }
};

export default store => next => (action) => {
  const result = next(action);

  routeActionHandler({ store, action });

  return result;
};
