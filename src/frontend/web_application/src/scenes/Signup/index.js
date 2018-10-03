import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import { withSettings } from '../../modules/settings';
import { withDevice } from '../../modules/device';
import Presenter from './presenter';

export default compose(
  withSettings(),
  withI18n(),
  withDevice()
)(Presenter);
