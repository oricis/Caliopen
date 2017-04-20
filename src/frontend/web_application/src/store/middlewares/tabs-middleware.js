import isEqual from 'lodash.isequal';
import { matchPath } from 'react-router-dom';
import { push } from 'react-router-redux';
import { getInfosFromName } from '../../services/application-manager';

import { SELECT_OR_ADD_TAB, REMOVE_TAB, addTab, selectOrAdd } from '../modules/tab';

const registeredRoutes = [
  '/discussions/:discussionId',
  '/contacts/:contactId',
  '/compose',
  '/settings/:setting',
];

const routeActionHandler = ({ store, action }) => {
  const { pathname } = action.payload;

  if (
    action.type === '@@router/LOCATION_CHANGE' &&
    registeredRoutes.find(route => matchPath(pathname, { path: route }))
  ) {
    store.dispatch(selectOrAdd({ pathname }));
  }
};

export default store => next => (action) => {
  const result = next(action);

  if (action.type === SELECT_OR_ADD_TAB) {
    const foundTab = store.getState().tab.tabs.find(tab => isEqual(action.payload.tab, tab));

    if (!foundTab) {
      store.dispatch(addTab(action.payload.tab));
    }
  }

  if (action.type === REMOVE_TAB) {
    const { pathname } = action.payload.tab;
    const state = store.getState();
    if (matchPath(state.router.location.pathname, { path: pathname, exact: true })) {
      const applicationName = store.getState().application.applicationName;
      store.dispatch(push(getInfosFromName(applicationName).route));
    }
  }

  routeActionHandler({ store, action });

  return result;
};
