import React, { Component, PropTypes } from 'react';
import Button from '../../../../components/Button';
import TextList, { ItemContent } from '../../../../components/TextList';
import DisplayDevice from './components/DisplayDevice';

import './style.scss';

const devices = [
  /* eslint-disable */
  {'device': {'device_id': '4537-es79-0001','name': 'Laptop work', 'type': 'laptop', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': 'master', 'pi': 99, 'ips': ['10.9.52.65', '192.168.1.1'], 'os': 'Linux', 'os_version': 'arch'}},
  {'device': {'device_id': '3237-es79-0002','name': 'Desktop', 'type': 'desktop', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 75, 'ips': [], 'os': 'Linux', 'os_version': 'arch'}},
  {'device': {'device_id': '4556-es79-0003','name': 'Smartphone', 'type': 'smartphone', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 39, 'ips': ['192.168.1.1'], 'os': 'Linux', 'os_version': 'arch'}},
  {'device': {'device_id': '4997-es79-0004','name': 'my smart fridge', 'type': 'tablet', signature_key:'', 'date_insert': "2016-05-09T15:01:42.381000", 'last_seen': '2016-05-09T15:01:42.381000', 'status': '', 'pi': 18, 'ips': ['10.9.52.65'], 'os': 'Linux', 'os_version': 'arch'}},
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

  componentDidMount() {
    setTimeout(() => {
      this.loadDevice();
    }, 200);
  }

  loadDevice() {
    let thisDevice = [];
    devices.map((d) => {
      if (d.device.status === 'master') {
        thisDevice = d.device;
      }

      return false;
    });

    this.setState({ device: thisDevice });
  }

  render() {
    const handleOnClick = (event) => {
      const deviceId = event.target.id;
      let thisDevice = [];
      this.state.devices.map((item) => {
        if (item.device.device_id === deviceId) {
          thisDevice = item.device;
        }

        return false;
      });

      this.setState({
        device: thisDevice,
      });
    };

    return (
      <div className="s-devices-management">
        <TextList className="s-devices-management__devices">
          {this.state.devices.map(list =>
            <ItemContent key={list.device.name}>
              <Button
                id={list.device.device_id}
                active={list.device === this.state.device && true}
                onClick={handleOnClick}
              >
                {list.device.name}
              </Button>
            </ItemContent>
          )}
        </TextList>
        <div className="s-devices-management__device">
          {this.state.device !== null &&
            <DisplayDevice device={this.state.device} />
          }
        </div>
      </div>
    );
  }
}

DevicesManagment.propTypes = {
  device: PropTypes.shape(),
};

export default DevicesManagment;
