import React, { Component, PropTypes } from 'react';
import Title from '../../../../components/Title';
import { SelectFieldGroup } from '../../../../components/form';
import DisplayDevice from './components/DisplayDevice';

import './style.scss';

const devices = [
  /* eslint-disable */
  {'device': {'device_id': '4537-es79-8tez','name': 'Laptop work', 'type': 'laptop', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 45, 'icon': '', 'ip': ['10.9.52.65']}},
  {'device': {'device_id': '3237-es79-8tez','name': 'Desktop', 'type': 'desktop', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 45, 'icon': '', 'ip': ['10.9.52.65', '192.168.1.1']}},
  {'device': {'device_id': '4556-es79-8tez','name': 'Smartphone', 'type': 'smartphone', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 45, 'icon': '', 'ip': ['192.168.1.1']}},
  {'device': {'device_id': '4997-es79-8tez','name': 'i-pad', 'type': 'tablet', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 45, 'icon': '', 'ip': ['10.9.52.65']}},
];
/* eslint-enable */

class DevicesManagment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices,
      device: {},
    };
  }

  render() {
    const handleInputChange = (event) => {
      const deviceId = event.target.value;
      let thisDevice = [];
      this.state.devices.map((item) => {
        if (item.device.device_id === deviceId) {
          thisDevice = item.device;
        }
      });

      this.setState({
        device: thisDevice,
      });
    };

    return (
      <div className="s-devices-management">
        <div className="s-devices-management__panel m-devices-list">
          <Title>Manage your device</Title>
          <SelectFieldGroup
            label="Select a device"
            name="select-device"
            onChange={handleInputChange}
            options={this.state.devices.map((d) => {
              return {
                value: d.device.device_id,
                label: d.device.name,
              };
            })}
          />
          {this.state.device !== null &&
            <DisplayDevice device={this.state.device} />
          }
        </div>

      </div>
    );
  }
}

DevicesManagment.propTypes = {
  device: PropTypes.node,
};

export default DevicesManagment;
