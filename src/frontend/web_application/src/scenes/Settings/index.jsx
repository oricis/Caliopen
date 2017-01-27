import React, { Component } from 'react';
import DevicesManagement from './components/DevicesManagement';
import SettingsNavigation from './components/SettingsNavigation';

import './style.scss';

const navigationLinks = [
  /* eslint-disable */
  {'link': {'title': 'User Interface', 'href': '#', active: false}},
  {'link': {'title': 'View', 'href': '#', active: false}},
  {'link': {'title': 'Contacts', 'href': '#', active: false}},
  {'link': {'title': 'Calendar', 'href': '#', active: false}},
  {'link': {'title': 'Server', 'href': '#', active: false}},
  {'link': {'title': 'Devices', 'href': '#', active: true}},
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
