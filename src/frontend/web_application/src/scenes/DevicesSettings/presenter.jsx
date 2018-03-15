import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageTitle } from '../../components/';
import DeviceSettings from './components/DeviceSettings';
import './style.scss';

class DevicesSettings extends Component {
  static propTypes = {
    devices: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    devices: [],
  };

  render() {
    const { devices } = this.props;

    return (
      <div className="s-devices-settings">
        <PageTitle />
        {devices.map(device => (
          <div key={device.device_id} className="s-devices-settings__device">
            <DeviceSettings device={device} />
          </div>
        ))}
      </div>
    );
  }
}

export default DevicesSettings;
