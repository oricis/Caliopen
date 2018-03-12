import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import { withDevices } from '../../modules/device';
import Presenter from './presenter';
import DeviceSettings from './components/DeviceSettings';

export { DeviceSettings };

export default compose(
  withDevices(),
  withI18n()
)(Presenter);
