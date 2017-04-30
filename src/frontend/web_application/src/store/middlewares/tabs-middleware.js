import isEqual from 'lodash.isequal';
import { matchPath } from 'react-router-dom';
import { push } from 'react-router-redux';
import { getInfosFromName } from '../../services/application-manager';
import { SELECT_OR_ADD_TAB, REMOVE_TAB, addTab, selectOrAdd } from '../modules/tab';
import { requestDiscussion } from '../modules/discussion';
import { requestContact } from '../modules/contact';

const registeredRoutes = [
  '/discussions/:discussionId',
  '/contacts/:contactId',
  '/compose',
  '/settings/:setting',
];

const routeActionHandler = ({ store, action }) => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return;
  }
  const { pathname } = action.payload;

  if (registeredRoutes.find(route => matchPath(pathname, { path: route }))) {
    store.dispatch(selectOrAdd(pathname));
  }
};

const selectTabByPathname = ({ store, pathname }) =>
  store.getState().tab.tabs.find(tab => isEqual(pathname, tab.pathname));

const createDiscussionTab = async ({ pathname, discussionId, store }) => {
  const { payload: { data: { discussion: { excerpt: label } } } }
    = await store.dispatch(requestDiscussion({ discussionId }));

  return {
    pathname,
    label,
    icon: 'comments-o',
  };
};

const createContactTab = async ({ pathname, contactId, store }) => {
  const { title: label } = await store.dispatch(requestContact({ contactId }));

  return {
    pathname,
    label,
    icon: 'user',
  };
};

const selectOrAddTabDiscussion = async ({ store, pathname }) => {
  const match = matchPath(pathname, { path: '/discussions/:discussionId' });
  if (!match) {
    return null;
  }
  const foundTab = selectTabByPathname({ store, pathname });
  if (foundTab) {
    return foundTab;
  }

  const { params: { discussionId } } = match;
  const tab = await createDiscussionTab({ pathname, discussionId, store });

  return store.dispatch(addTab(tab));
};

const selectOrAddTabContact = async ({ store, pathname }) => {
  const match = matchPath(pathname, { path: '/contacts/:contactId' });
  if (!match) {
    return null;
  }
  const foundTab = selectTabByPathname({ store, pathname });
  if (foundTab) {
    return foundTab;
  }

  const { params: { contactId } } = match;
  const tab = await createContactTab({ pathname, contactId, store });

  return store.dispatch(addTab(tab));
};

// TODO: implement tab for settings
// eslint-disable-next-line
const selectOrAddTabSetting = ({ store, pathname }) => {
  if (matchPath(pathname, { path: '/settings/:subpath' })) {
    console.log('selectOrAddTabSetting is not yet implemented');
  }
};

export default store => next => (action) => {
  const result = next(action);

  if (action.type === SELECT_OR_ADD_TAB) {
    const { payload: { pathname } } = action;
    [selectOrAddTabDiscussion, selectOrAddTabContact, selectOrAddTabSetting]
      .forEach(fn => fn({ store, pathname }));
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
