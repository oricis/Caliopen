import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import { withSettings } from '../../../../modules/settings';
import Presenter from './presenter';

export default compose(
  withSettings(),
  withI18n()
)(Presenter);
