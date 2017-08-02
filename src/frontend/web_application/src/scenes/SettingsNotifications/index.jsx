import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Section from '../../components/Section';
import BrowserNotifications from './components//BrowserNotifications';

class SettingsNotifications extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    // const { __, isFetching, contact } = this.props;

    return (
      <div className="s-settings-notifications">
        <Section title="notifications settings">
          settings notifications
        </Section>
        <Section title="browser notifications settings">
          <BrowserNotifications />
        </Section>
      </div>

    );
  }
}

export default SettingsNotifications;
