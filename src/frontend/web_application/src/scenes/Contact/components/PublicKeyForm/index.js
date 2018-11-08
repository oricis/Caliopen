import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { requestPublicKeys, createPublicKey, updatePublicKey, deletePublicKey } from '../../../../store/modules/public-key';
import Presenter from './presenter';

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.publicKey,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    requestPublicKeys,
    savePublicKey: ownProps.publicKey ? updatePublicKey : createPublicKey,
    deletePublicKey,
  }, dispatch),
  onSubmit: values => Promise.resolve(values),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'public-key-new' }),
)(Presenter);
