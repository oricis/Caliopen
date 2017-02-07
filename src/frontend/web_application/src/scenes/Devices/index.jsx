import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { requestDevices } from '../../store/modules/device';
import Presenter from './presenter';
import Device from './components/Device';

export { Device };

const devicesSelector = state => state.device.devices;
const mapStateToProps = createSelector(
  [devicesSelector],
  devices => ({ devices })
);
const mapDispatchToProps = dispatch => bindActionCreators({ requestDevices }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
