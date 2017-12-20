import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import MenuBar from '../../components/MenuBar';

class Settings extends PureComponent {
  static propTypes = {
    pathname: PropTypes.string,
    children: PropTypes.node,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    pathname: undefined,
    children: null,
  };

  render() {
    const { i18n, children, pathname } = this.props;

    const navLinks = [
      // { title: i18n.t`settings.identities`, to: '/settings/identities' },
      { title: i18n.t`settings.application`, to: '/settings/application' },
      // { title: i18n.t`settings.tags`, to: '/settings/tags' },
      // { title: i18n.t`settings.devices`, to: '/settings/devices' },
      //{ title: i18n.t`settings.signatures`, to: '/settings/signatures' },
    ].map(link => ({
      ...link,
      isActive: matchPath(pathname, { path: link.to, exact: false, strict: false }) && true,
    }));

    return (
      <div className="l-settings">
        <MenuBar className="l-settings__menu-bar" navLinks={navLinks} />
        <div className="l-settings__panel">{children}</div>
      </div>
    );
  }
}

export default Settings;
