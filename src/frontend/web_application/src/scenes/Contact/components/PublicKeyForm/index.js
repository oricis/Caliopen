import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { requestPublicKeys, createPublicKey, updatePublicKey, deletePublicKey } from '../../../../store/modules/public-key';
import Presenter from './presenter';

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.publicKey,
  form: ownProps.publicKey ? `public-key-${ownProps.publicKey.key_id}` : 'public-key-new',
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    requestPublicKeys,
    createPublicKey,
    updatePublicKey,
    deletePublicKey,
  }, dispatch),
  onSubmit: values => Promise.resolve(values),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm(),
)(Presenter);
