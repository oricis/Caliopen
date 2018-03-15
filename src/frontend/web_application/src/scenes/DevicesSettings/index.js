import { compose } from 'redux';
import { withDevices } from '../../modules/device';
import Presenter from './presenter';
import DeviceSettings from './components/DeviceSettings';

export { DeviceSettings };

export default compose(
  withDevices(),
)(Presenter);
