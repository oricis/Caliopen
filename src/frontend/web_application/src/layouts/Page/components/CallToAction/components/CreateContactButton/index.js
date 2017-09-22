import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';
import { withNotification } from '../../../../../../services/notification';

export default compose(
  withNotification(),
  withTranslator()
)(Presenter);
