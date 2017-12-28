import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { push } from 'react-router-redux';
import { withSettings } from '../../modules/settings';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({ onSignupSuccess: push }, dispatch);

export default compose(
  withSettings(),
  connect(null, mapDispatchToProps),
  withI18n()
)(Presenter);
