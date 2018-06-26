import { compose } from 'redux';
import Presenter from './presenter';
import { withNotification } from '../../../../../../modules/userNotify';

export default compose(withNotification())(Presenter);
