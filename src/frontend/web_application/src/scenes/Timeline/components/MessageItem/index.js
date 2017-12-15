import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import { withSettings } from '../../../../modules/settings';
import Presenter from './presenter';

export default compose(
  withSettings(),
  withTranslator()
)(Presenter);
