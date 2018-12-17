import { compose } from 'redux';
import { withI18n } from '@lingui/react';
import { withDevice } from '../../modules/device';
import Presenter from './presenter';

export default compose(
  withI18n(),
  withDevice(),
)(Presenter);
