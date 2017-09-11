import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import Section from '../../components/Section';
import BrowserNotifications from './components//BrowserNotifications';
import NotificationForm from './components/NotificationForm';

class SettingsNotifications extends PureComponent {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    return (
      <div className="s-settings-notifications">
        <Section title="notifications settings">
          <NotificationForm />
        </Section>
        <Section title="browser notifications settings">
          <BrowserNotifications />
        </Section>
      </div>

    );
  }
}

export default SettingsNotifications;
