import { matchPath } from 'react-router-dom';
import { push } from 'react-router-redux';
import { getInfosFromName } from '../../services/application-manager';
import { getTranslator } from '../../services/i18n';
import { SELECT_OR_ADD_TAB, REMOVE_TAB, addTab, selectOrAdd, updateTab } from '../modules/tab';
import { requestDiscussion } from '../modules/discussion';
import { requestContact } from '../modules/contact';
import { getRouteConfig, flattenRouteConfig } from '../../routes';

const registeredRoutes = [
  '/discussions/:discussionId',
  '/contacts/:contactId',
  '/compose',
  '/settings/:setting',
  '/user/:setting',
];

const routeActionHandler = ({ store, action }) => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return;
  }
  const { pathname } = action.payload;

  if (registeredRoutes.find(route => matchPath(pathname, { path: route }))) {
    store.dispatch(selectOrAdd({ pathname }));
  }
};

const selectTabByPathname = ({ store, pathname }) =>
  store.getState().tab.tabs.find(tab => pathname === tab.pathname);

const createDiscussionTab = async ({ pathname, discussionId, store }) => {
  const { payload: { data: { excerpt: label } } }
    = await store.dispatch(requestDiscussion({ discussionId }));

  return {
    pathname,
    label,
    icon: 'comments-o',
  };
};

const createContactTab = async ({ pathname, contactId, store }) => {
  const { payload: { data: { title: label } } }
    = await store.dispatch(requestContact({ contactId }));

  return {
    pathname,
    label,
    icon: 'user',
  };
};
const createComposeTab = ({ pathname }) => {
  const { translate: __ } = getTranslator();

  return {
    pathname,
    label: __('compose.route.label'),
    icon: 'pencil',
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

const getSettingTab = ({ pathname }) => {
  const { translate: __ } = getTranslator();

  const routeConfig = flattenRouteConfig(getRouteConfig({ __ }))
    .filter(route => route.path.indexOf('/settings/') !== -1)
    .find(route => matchPath(pathname, { path: route.path }));

  return {
    pathname,
    label: (routeConfig && routeConfig.label) || __('settings.route.label.default'),
    icon: 'cog',
  };
};

const selectOrAddTabSetting = ({ store, pathname }) => {
  if (!matchPath(pathname, { path: '/settings/:subpath' })) {
    return null;
  }

  const original = store.getState().tab.tabs
    .find(tab => matchPath(tab.pathname, { path: '/settings' }));

  const tab = getSettingTab({ pathname });
  if (original) {
    return store.dispatch(updateTab({ original, tab }));
  }

  return store.dispatch(addTab(tab));
};

const getUserTab = ({ pathname }) => {
  const { translate: __ } = getTranslator();

  const routeConfig = flattenRouteConfig(getRouteConfig({ __ }))
    .filter(route => route.path.indexOf('/user/') !== -1)
    .find(route => matchPath(pathname, { path: route.path }));

  return {
    pathname,
    label: (routeConfig && routeConfig.label) || __('user.route.label.default'),
    icon: 'user',
  };
};

const selectOrAddTabUser = ({ store, pathname }) => {
  if (!matchPath(pathname, { path: '/user/:subpath' })) {
    return null;
  }

  const original = store.getState().tab.tabs
    .find(tab => matchPath(tab.pathname, { path: '/user' }));

  const tab = getUserTab({ pathname });
  if (original) {
    return store.dispatch(updateTab({ original, tab }));
  }

  return store.dispatch(addTab(tab));
};


const selectOrAddTabCompose = ({ store, pathname }) => {
  const match = matchPath(pathname, { path: '/compose' });
  if (!match) {
    return null;
  }
  const foundTab = selectTabByPathname({ store, pathname });
  if (foundTab) {
    return foundTab;
  }

  const tab = createComposeTab({ pathname, store });

  return store.dispatch(addTab(tab));
};

export default store => next => (action) => {
  routeActionHandler({ store, action });

  const result = next(action);

  if (action.type === SELECT_OR_ADD_TAB) {
    const { payload: { pathname } } = action;
    [selectOrAddTabDiscussion, selectOrAddTabContact, selectOrAddTabSetting,
      selectOrAddTabUser, selectOrAddTabCompose]
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

  return result;
};
