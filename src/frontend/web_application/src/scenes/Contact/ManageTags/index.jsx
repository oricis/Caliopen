import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { updateContact } from '../../../store/modules/contact';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  onContactChange: updateContact,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
