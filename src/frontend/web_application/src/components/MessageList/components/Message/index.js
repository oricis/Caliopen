import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import { withSettings } from '../../../../services/settings';
import Presenter from './presenter';

export default compose(
  withSettings(),
  withTranslator()
)(Presenter);
