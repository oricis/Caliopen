import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { withDevice } from '../../../../modules/device';
import Presenter from './presenter';

const devicesSelector = state => state.device.devicesById;
const deviceSelector = (state, ownProps) => ownProps.device;

const clientDeviceSelector = (state, { clientDevice }) => clientDevice;
const currentDeviceSelector = createSelector(
  [clientDeviceSelector, devicesSelector],
  (clientDevice, devicesById) => clientDevice && devicesById[clientDevice.device_id]
);

const mapStateToProps = createSelector(
  [devicesSelector, deviceSelector, currentDeviceSelector],
  (devicesById, device, currentDevice) => ({
    device,
    isLastVerifiedDevice: device && device.status === 'verified' && Object.keys(devicesById)
      .filter(id => devicesById[id].status === 'verified')
      .length <= 1,
    isCurrentDevice: currentDevice && currentDevice === device,
    isCurrentDeviceVerified: currentDevice && currentDevice.status === 'verified',
  })
);

export default compose(
  withI18n(),
  withDevice(),
  connect(mapStateToProps)
)(Presenter);
