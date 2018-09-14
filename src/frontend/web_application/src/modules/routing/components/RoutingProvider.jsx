import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import { withI18n } from 'lingui-react';
import { RoutingContext } from '../contexts/RoutingContext';
import Signin from '../../../scenes/Signin';
import Signup from '../../../scenes/Signup';
import ForgotPassword from '../../../scenes/ForgotPassword';
import ResetPassword from '../../../scenes/ResetPassword';
import Contact from '../../../scenes/Contact';
import AuthPageLayout from '../../../layouts/AuthPage';
import PageLayout from '../../../layouts/Page2';
import SettingsLayout from '../../../layouts/Settings';
import UserLayout from '../../../layouts/User';
import Timeline from '../../../scenes/Timeline2';
import NewDraft from '../../../scenes/NewDraft';
import SearchResults from '../../../scenes/SearchResults';
import UserProfile from '../../../scenes/UserProfile';
import UserSecurity from '../../../scenes/UserSecurity';
import UserPrivacy from '../../../scenes/UserPrivacy';
import RemoteIdentitySettings from '../../../scenes/RemoteIdentitySettings';
// import SettingsSignatures from '../../../scenes/SettingsSignatures';
import ApplicationSettings from '../../../scenes/ApplicationSettings';
import Tags from '../../../scenes/TagsSettings';
import Discussion from '../../../scenes/Discussion';
import ContactBook from '../../../scenes/ContactBook';
import PageNotFound from '../../../scenes/PageNotFound';
import DevicesSettings from '../../../scenes/DevicesSettings';
import NewDeviceInfo from '../../../scenes/NewDeviceInfo';
import { renderParticipant } from '../../../services/message';
import { formatName } from '../../../services/contact';

export const tabMatchRoute = ({ pathname, routeConfig }) => matchPath(pathname, routeConfig);
export const tabMatchPathname = ({ pathname, tab }) => pathname === tab.location.pathname;

const tabMatchSettings = ({ pathname }) => matchPath(pathname, {
  path: '/settings/:type',
  exact: true,
  strict: false,
});

@withI18n()
class RoutingProvider extends Component {
  static propTypes = {
    i18n: PropTypes.shape({
      _: PropTypes.func.isRequired,
    }).isRequired,
    settings: PropTypes.shape({}),
  };
  state = {
    routes: [],
  };

  componentWillMount() {
    this.initializeRoutes();
  }

  // TODO: refactor
  //  route initialization can be done by scene via root App component
  initializeRoutes = () => {
    const { i18n } = this.props;
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      routes: [
        {
          path: '/auth',
          component: AuthPageLayout,
          app: 'auth',
          routes: [
            { path: '/auth/', exact: true, redirect: '/auth/signin' },
            { path: '/auth/signin', component: Signin },
            { path: '/auth/signup', component: Signup },
            { path: '/auth/forgot-password', component: ForgotPassword },
            { path: '/auth/passwords/reset/:key', component: ResetPassword },
            { path: '/auth/signout', redirect: '/auth/signin' },
          ],
        },
        {
          path: '/',
          component: PageLayout,
          routes: [
            {
              path: '/',
              exact: true,
              component: Timeline,
              app: 'discussion',
              tab: {
                type: 'application',
                icon: 'home',
                renderLabel: () => i18n._('route.timeline.label', { defaults: 'Timeline' }),
                tabMatch: tabMatchRoute,
              },
            },
            {
              path: '/discussions/:discussionId',
              component: Discussion,
              app: 'discussion',
              tab: {
                type: 'discussion',
                renderLabel: ({ discussion }) => {
                  if (discussion) {
                    return discussion.participants.map(renderParticipant).join(' ');
                  }

                  return i18n._('route.discussion.label', { defaults: 'Discussion ...' });
                },
                tabMatch: tabMatchPathname,
              },
            },
            {
              path: '/compose',
              component: NewDraft,
              app: 'discussion',
              exact: true,
              strict: true,
              // tab: {
              //   type: 'compose',
              //   renderLabel: () => i18n._('compose.route.label'),
              //   icon: 'pencil',
              //   tabMatch: tabMatchRoute,
              // },
            },
            {
              path: '/compose/:internalId',
              component: NewDraft,
              app: 'discussion',
              tab: {
                type: 'compose',
                icon: 'pencil',
                renderLabel: () => i18n._('route.compose.label', { defaults: 'Compose' }),
                tabMatch: tabMatchPathname,
              },
            },
            {
              path: '/contacts',
              exact: true,
              component: ContactBook,
              app: 'contact',
              tab: {
                type: 'application',
                icon: 'address-book',
                renderLabel: () => i18n._('route.contact-book.label', { defaults: 'Contacts' }),
                tabMatch: tabMatchRoute,
              },
            },
            {
              path: '/contacts/:contactId',
              component: Contact,
              app: 'contact',
              tab: {
                type: 'contact',
                icon: 'address-book',
                renderLabel: ({ contact }) => {
                  const { settings: { contact_display_format: format } } = this.props;

                  return (contact && formatName({ contact, format })) || i18n._('contact.profile.name_not_set', { defaults: '(N/A)' });
                },
                tabMatch: tabMatchPathname,
              },
            },
            {
              path: '/new-contact',
              component: Contact,
              app: 'contact',
              tab: {
                type: 'default',
                icon: 'address-book',
                renderLabel: () => i18n._('route.new-contact.label', { defaults: 'New contact' }),
                tabMatch: tabMatchRoute,
              },
            },
            {
              path: '/search-results',
              component: SearchResults,
              app: 'discussion',
              tab: {
                type: 'default',
                icon: 'search',
                renderLabel: () => i18n._('route.search-results.label', { defaults: 'New contact' }),
                tabMatch: tabMatchRoute,
              },
            },
            {
              path: '/user',
              app: 'user',
              component: UserLayout,
              tab: {
                type: 'default',
                icon: 'user',
                renderLabel: () => i18n._('route.user.label.default', { defaults: 'Account' }),
                tabMatch: tabMatchRoute,
              },
              routes: [
                {
                  path: '/user/profile',
                  component: UserProfile,
                  tab: {
                    type: 'default',
                    icon: 'user',
                    renderLabel: () => i18n._('route.user.label.profile', { defaults: 'Profile' }),
                    tabMatch: tabMatchRoute,
                  },
                },
                {
                  path: '/user/privacy',
                  component: UserPrivacy,
                  tab: {
                    type: 'default',
                    icon: 'user',
                    renderLabel: () => i18n._('route.user.label.privacy', { defaults: 'Privacy' }),
                    tabMatch: tabMatchRoute,
                  },
                },
                {
                  path: '/user/security',
                  component: UserSecurity,
                  tab: {
                    type: 'default',
                    icon: 'user',
                    renderLabel: () => i18n._('route.user.label.security', { defaults: 'Security' }),
                    tabMatch: tabMatchRoute,
                  },
                },
              ],
            },
            {
              path: '/settings',
              app: 'settings',
              component: SettingsLayout,
              renderLabel: () => i18n._('route.settings.label.default', { defaults: 'Settings' }),
              routes: [
                {
                  path: '/settings/identities',
                  component: RemoteIdentitySettings,
                  tab: {
                    type: 'default',
                    icon: 'cog',
                    renderLabel: () => i18n._('route.settings.label.identities', { defaults: 'Security' }),
                    tabMatch: tabMatchSettings,
                  },
                },
                {
                  path: '/settings/application',
                  component: ApplicationSettings,
                  tab: {
                    type: 'default',
                    icon: 'cog',
                    renderLabel: () => i18n._('route.settings.label.application', { defaults: 'Devices' }),
                    tabMatch: tabMatchSettings,
                  },
                },
                {
                  path: '/settings/tags',
                  component: Tags,
                  tab: {
                    type: 'default',
                    icon: 'cog',
                    renderLabel: () => i18n._('route.settings.label.tags', { defaults: 'Tags' }),
                    tabMatch: tabMatchSettings,
                  },
                },

                // TODO: enable devices when API ready: https://tree.taiga.io/project/caliopen-caliopen/us/314?no-milestone=1
                {
                  path: '/settings/devices',
                  component: DevicesSettings,
                  tab: {
                    type: 'default',
                    icon: 'cog',
                    renderLabel: () => i18n._('route.settings.label.devices', { defaults: 'Devices' }),
                    tabMatch: tabMatchSettings,
                  },
                },
                {
                  path: '/settings/new-device',
                  component: NewDeviceInfo,
                  tab: {
                    type: 'default',
                    icon: 'cog',
                    renderLabel: () => i18n._('route.settings.label.devices', { defaults: 'Devices' }),
                    tabMatch: tabMatchSettings,
                  },
                },

                // TODO: enable signatures
                // {
                //  path: '/settings/signatures',
                //  component: SettingsSignatures,
                // tab: {
                //   type: 'default',
                //   icon: 'cog',
                //   renderLabel: () => i18n._('route.settings.label.signatures',
                // { defaults: 'Signatures' }),
                //   tabMatch: tabMatchRoute,
                // },
                // },
              ],
            },
            {
              component: PageNotFound,
            },
          ],
        },
        {
          component: PageNotFound,
        },
      ],
    });
  }

  render() {
    return (<RoutingContext.Provider value={this.state} {...this.props} />);
  }
}

export default RoutingProvider;
