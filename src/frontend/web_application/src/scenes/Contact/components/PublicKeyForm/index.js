import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { requestPublicKeys, createPublicKey } from '../../../../store/modules/public-key';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    requestPublicKeys,
    createPublicKey,
  }, dispatch),
  onSubmit: values => Promise.resolve(values),
});

export default compose(
  connect(null, mapDispatchToProps),
  reduxForm({ form: 'public-key-new' }),
)(Presenter);
