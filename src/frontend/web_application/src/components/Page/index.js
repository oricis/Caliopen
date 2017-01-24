import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestUser } from '../../store/modules/user';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({ requestUser }, dispatch);

export default connect(undefined, mapDispatchToProps)(Presenter);
