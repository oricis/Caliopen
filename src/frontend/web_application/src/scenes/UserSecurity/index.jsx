import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { withNotification } from '../../hoc/notification';
import { withUser } from '../../hoc/user';
import { requestUser } from '../../store/modules/user';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  requestUser,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator(),
  withUser(),
  withNotification(),
)(Presenter);
