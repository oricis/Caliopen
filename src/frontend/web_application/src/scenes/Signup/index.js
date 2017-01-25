import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({ onSignupSuccess: push }, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
