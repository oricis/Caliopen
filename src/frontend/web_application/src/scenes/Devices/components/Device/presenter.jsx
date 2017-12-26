import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeviceBase from '../../../../components/Device';
import Spinner from '../../../../components/Spinner';

class Device extends Component {
  static propTypes = {
    device: PropTypes.shape({}),
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    device: null,
    isFetching: false,
  };

  render() {
    const { device, isFetching } = this.props;

    if (isFetching) {
      return <Spinner isLoading />;
    }

    return (device && <DeviceBase device={device} />) || null;
  }
}

export default Device;
