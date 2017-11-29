import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { withUser } from '../../hoc/user';
import { requestUser } from '../../store/modules/user';
import { updateContact } from '../../store/modules/contact';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  requestUser,
  updateContact,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withUser(),
  withTranslator()
)(Presenter);
