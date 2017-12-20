import React, { Component } from 'react';
import { Trans } from 'lingui-react';
import PropTypes from 'prop-types';
import DeviceBase from '../../../../components/Device';
import Spinner from '../../../../components/Spinner';

class Device extends Component {
  static propTypes = {
    device: PropTypes.shape({}),
    isFetching: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    device: null,
    isFetching: false,
  };

  render() {
    const { device, isFetching, i18n } = this.props;

    if (isFetching) {
      return <Spinner isLoading />;
    }

    return (device && <DeviceBase device={device} __={__} />) || null;
  }
}

export default Device;
