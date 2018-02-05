import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link, PageTitle, Icon, NavList, NavItem } from '../../components/';

import './style.scss';

class Devices extends Component {
  static propTypes = {
    devices: PropTypes.arrayOf(PropTypes.shape({})),
    requestDevices: PropTypes.func.isRequired,
    children: PropTypes.node,
    params: PropTypes.shape({ }),
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    devices: [],
    params: { params: { deviceId: null } },
    children: null,
  };

  componentDidMount() {
    this.props.requestDevices();
  }

  renderDevice(device) {
    const { params: { deviceId } } = this.props;
    const isVerified = device.signature_key && true;

    return (
      <NavItem key={device.device_id} active={device.device_id === deviceId}>
        <Link
          to={`/settings/devices/${device.device_id}`}
          className={classnames('s-devices__nav-item', { 's-devices__nav-item--verify': !isVerified })}
          active={device.device_id === deviceId}
          expanded
        >
          {!isVerified ?
            <Icon type="exclamation-triangle" spaced /> :
            <Icon type="check" spaced />
          }
          {device.name}
        </Link>
      </NavItem>
    );
  }

  render() {
    const { devices, children, i18n } = this.props;

    return (
      <div className="s-devices">
        <PageTitle />
        <NavList className="s-devices__nav" dir="vertical">
          {devices.map(device => this.renderDevice(device))}
        </NavList>
        <section className="s-devices__device">
          {!children ? i18n._('device.no-selected-device', { defaults: 'No selected device' }) : children}
        </section>
      </div>
    );
  }
}

export default Devices;
