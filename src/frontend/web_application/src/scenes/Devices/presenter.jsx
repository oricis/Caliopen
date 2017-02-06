import React, { Component, PropTypes } from 'react';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import NavList, { ItemContent } from '../../components/NavList';
import TextBlock from '../../components/TextBlock';
import DeviceForm from '../../components/DeviceForm/presenter';

import './style.scss';

const devices = [
  /* eslint-disable */
  {'device': {'device_id': '4537-es79-0001','name': 'Laptop work', 'type': 'laptop', signature_key: 'w00t', 'date_insert': "2016-05-09T15:01:42", 'last_seen': '2017-02-01T15:00:42', 'status': 'master', 'pi': 99, 'ips': ['10.9.52.65', '192.168.1.1'], 'os': 'Linux', 'os_version': 'arch'}},
  {'device': {'device_id': '3237-es79-0002','name': 'Desktop', 'type': 'desktop', signature_key: null, 'date_insert': "2016-05-09T15:01:42", 'last_seen': '2017-01-01T15:00:42', 'status': '', 'pi': 75, 'ips': [], 'os': 'Linux', 'os_version': 'arch'}},
  {'device': {'device_id': '4556-es79-0003','name': 'Smartphone', 'type': 'smartphone', signature_key: 'w00t', 'date_insert': "2016-05-09T15:01:42", 'last_seen': '2017-01-01T15:00:42', 'status': '', 'pi': 39, 'ips': ['192.168.1.1'], 'os': 'Linux', 'os_version': 'arch'}},
  {'device': {'device_id': '4997-es79-0004','name': 'my smart fridge', 'type': 'tablet', signature_key: 'w00t', 'date_insert': "2012-04-20T16:20:00", 'last_seen': '2012-04-20T16:20:00', 'status': '', 'pi': 18, 'ips': ['10.9.52.65'], 'os': 'Linux', 'os_version': 'arch'}},
];
/* eslint-enable */

class Devices extends Component {
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
    }, 20);
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

    const noop = str => str;

    return (
      <div className="s-devices">
        <NavList className="s-devices__nav" dir="vertical">
          {this.state.devices.map(list =>
            <ItemContent
              key={list.device.device_id}
              active={list.device === this.state.device && true}
            >
              <Button
                id={list.device.device_id}
                className={list.device.signature_key === null ? 's-devices__nav-item s-devices__nav-item--verify' : 's-devices__nav-item'}
                active={list.device === this.state.device && true}
                onClick={handleOnClick}
                expanded
              >
                {list.device.signature_key === null ?
                  <Icon type="exclamation-triangle" spaced /> :
                  <Icon type="check" spaced />
                }{list.device.name}
              </Button>
            </ItemContent>
          )}
        </NavList>
        <section className="s-devices__device">
          {this.state.device !== null &&
            <DeviceForm device={this.state.device} __={noop} />
          }
        </section>
      </div>
    );
  }
}

Devices.propTypes = {
  device: PropTypes.shape(),
};

export default Devices;
