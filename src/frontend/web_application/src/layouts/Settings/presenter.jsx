import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import MenuBar from '../../components/MenuBar';

class Settings extends PureComponent {
  static propTypes = {
    pathname: PropTypes.string,
    children: PropTypes.node,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    pathname: undefined,
    children: null,
  };

  render() {
    const { __, children, pathname } = this.props;

    const navLinks = [
      // { title: __('settings.identities'), to: '/settings/identities' },
      { title: __('settings.application'), to: '/settings/application' },
      // { title: __('settings.tags'), to: '/settings/tags' },
      // { title: __('settings.devices'), to: '/settings/devices' },
      //{ title: __('settings.signatures'), to: '/settings/signatures' },
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
