import { requestMessages } from '../../store/modules/message';
import { requestContacts } from '../../store/modules/contact';

const APPLICATIONS = {
  discussions: {
    route: '/',
    icon: 'comments',
    label: 'header.menu.discussions',
    refreshAction: dispatch => dispatch(requestMessages('timeline', '0')),
  },
  contacts: {
    route: '/contacts',
    icon: 'users',
    label: 'header.menu.contacts',
    refreshAction: dispatch => dispatch(requestContacts()),
  },
};

export const getLabels = __ => ({
  discussions: __('header.menu.discussions'),
  contacts: __('header.menu.contacts'),
});

export const getInfosFromName = name => ({
  name,
  ...APPLICATIONS[name],
});

export const getInfosFromRoute = (route) => {
  const applicationName = Object.keys(APPLICATIONS)
    .find(name => APPLICATIONS[name].route === route);

  if (!applicationName) {
    return undefined;
  }

  return getInfosFromName(applicationName);
};

export const getApplications = () => Object.keys(APPLICATIONS).map(getInfosFromName);
