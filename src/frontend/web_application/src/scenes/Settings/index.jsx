import React, { Component } from 'react';
import DevicesManagement from './components/DevicesManagement';
import SettingsNavigation from './components/SettingsNavigation';

import './style.scss';

const navigationLinks = [
  /* eslint-disable */
  {'link': {'title': 'User Interface', 'href': '#', icon: 'window-maximize', active: false}},
  {'link': {'title': 'View', 'href': '#', icon: 'th-large', active: false}},
  {'link': {'title': 'Contacts', 'href': '#', icon: 'users', active: false}},
  {'link': {'title': 'Calendar', 'href': '#', icon: 'calendar', active: false}},
  {'link': {'title': 'Server', 'href': '#', icon: 'server', active: false}},
  {'link': {'title': 'Devices', 'href': '#', icon: 'laptop', active: true}},
];
  /* eslint-enable */

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="s-settings">
        <SettingsNavigation
          links={navigationLinks}
          className="s-settings__nav"
        />
        <div className="s-settings__panel">
          <DevicesManagement />
        </div>
      </div>
    );
  }
}

export default Settings;
