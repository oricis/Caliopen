import { compose } from 'redux';
import { withSettings } from '../../../../modules/settings';
import Presenter from './presenter';

export default compose(
  withSettings()
)(Presenter);
