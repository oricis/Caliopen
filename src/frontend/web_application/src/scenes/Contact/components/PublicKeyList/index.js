import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestPublicKeys, deletePublicKey } from '../../../../store/modules/public-key';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    requestPublicKeys,
    deletePublicKey,
  }, dispatch),
});


export default compose(connect(null, mapDispatchToProps))(Presenter);
