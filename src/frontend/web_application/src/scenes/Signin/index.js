import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import Presenter from './presenter';
import { withInitSettings } from '../../modules/settings';

export default compose(
  withI18n(),
  withInitSettings()
)(Presenter);
