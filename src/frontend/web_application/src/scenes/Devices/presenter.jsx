import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../../components/Link';
import Icon from '../../components/Icon';
import NavList, { ItemContent } from '../../components/NavList';
import './style.scss';

class Devices extends Component {
  static propTypes = {
    devices: PropTypes.arrayOf(PropTypes.shape({})),
    requestDevices: PropTypes.func.isRequired,
    children: PropTypes.node,
    params: PropTypes.shape({ }),
    __: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.requestDevices();
  }

  render() {
    const { devices, children, params: { deviceId = null }, __ } = this.props;

    return (
      <div className="s-devices">
        <NavList className="s-devices__nav" dir="vertical">
          {devices.map(device => (
            <ItemContent key={device.device_id} active={device.device_id === deviceId}>
              <Link
                to={`/devices/${device.device_id}`}
                className={classnames('s-devices__nav-item', { 's-devices__nav-item--verify': device.signature_key === null })}
                active={device.device_id === deviceId}
                expanded
              >
                {!device.signature_key ?
                  <Icon type="exclamation-triangle" spaced /> :
                  <Icon type="check" spaced />
                }
                {device.name}
              </Link>
            </ItemContent>
          ))}
        </NavList>
        <section className="s-devices__device">
          {!children ? __('device.no-selected-device') : children}
        </section>
      </div>
    );
  }
}

export default Devices;
