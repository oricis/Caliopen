import { compose } from 'redux';
import { withI18n } from '@lingui/react';
import { withInitSettings } from '../../modules/settings';
import { withDevice } from '../../modules/device';
import Presenter from './presenter';

export default compose(
  withI18n(),
  withInitSettings(),
  withDevice(),
)(Presenter);
