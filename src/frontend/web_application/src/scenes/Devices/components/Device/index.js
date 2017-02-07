import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';

const devicesSelector = state => state.device.devices;
const deviceIdSelector = (state, ownProps) => ownProps.params.deviceId;

const mapStateToProps = createSelector(
  [devicesSelector, deviceIdSelector],
  (devices, deviceId) => ({ device: devices.find(device => device.device_id === deviceId) })
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
