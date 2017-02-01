import React, { Component } from 'react';
import DevicesManagement from './components/DevicesManagement';
import SettingsNavigation from './components/SettingsNavigation';

import './style.scss';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="s-settings">
        <SettingsNavigation className="s-settings__nav" />
        <div className="s-settings__panel">
          <DevicesManagement />
        </div>
      </div>
    );
  }
}

export default Settings;
