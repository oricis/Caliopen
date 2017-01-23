import React, { Component } from 'react';
import DevicesManagment from './components/DevicesManagment';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { FormGrid, FormRow, FormColumn } from '../../components/form';

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
        <FormGrid className="s-settings__nav">
          <FormRow>
            {navigationLinks.map(nav =>
              <FormColumn size="shrink">
                <Button active={nav.link.active} className="s-settings__nav-item"><Icon type={nav.link.icon} spaced /> {nav.link.title}</Button>
              </FormColumn>
            )
            }
          </FormRow>
        </FormGrid>
        <div className="s-settings__pannel">
          <DevicesManagment />
        </div>
      </div>
    );
  }
}

export default Settings;
