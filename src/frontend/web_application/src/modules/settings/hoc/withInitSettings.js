import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { initSettings } from '../actions/initSettings';

const mapDispatchToProps = dispatch => bindActionCreators({
  initSettings,
}, dispatch);

const withInitSettings = () => Component => connect(null, mapDispatchToProps)(Component);

export default withInitSettings;
