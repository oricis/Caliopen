import { matchPath } from 'react-router-dom';
import { getApplications, getInfosFromName } from '../../services/application-manager';
import { switchApplication, REFRESH_APPLICATION } from '../modules/application';

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

const refreshAppHandler = ({ store, action }) => {
  if (action.type !== REFRESH_APPLICATION) {
    return;
  }

  getInfosFromName(action.payload.applicationName).refreshAction(store.dispatch);
};

export default store => next => (action) => {
  const result = next(action);

  routeActionHandler({ store, action });
  refreshAppHandler({ store, action });

  return result;
};
