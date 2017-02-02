import React, { Component, PropTypes } from 'react';
import NavList, { ItemContent } from '../../components/NavList';
import Link from '../../components/Link';

import './style.scss';

const navLinks = [
  /* eslint-disable */
  {'title': 'Accounts', 'href': '/settings/accounts', active: false},
  {'title': 'Application', 'href': '/settings/appplication', active: false},
  {'title': 'Devices', 'href': '/settings/devices', active: true},
  {'title': 'Signatures', 'href': '/settings/signatures', active: false},
];

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navLinks,
    };
  }

  render() {
    return (
      <div className="l-settings">
        <NavList className="l-settings__nav">
          {this.state.navLinks.map(link =>
            <ItemContent active={link.active} large key={link.title}><Link noDecoration href={link.href} active={link.active}>{link.title}</Link></ItemContent>
          )}
        </NavList>
        <div className="l-settings__panel">{this.props.children}</div>
      </div>
    );
  }
}

Settings.propTypes = {
  children: PropTypes.node,
};

export default Settings;
