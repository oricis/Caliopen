import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { push } from 'react-router-redux';
import Composer from 'react-composer';
import { withSettings } from '../../modules/settings';
import { WithDevice } from '../../modules/device';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({ onSignupSuccess: push }, dispatch);

export default compose(
  withSettings(),
  connect(null, mapDispatchToProps),
  withI18n()
)(props => (
  <Composer
    components={[
      <WithDevice />,
    ]}
    renderPropName="render"
  >
    {([{ clientDevice }]) => (
      <Presenter {...props} clientDevice={clientDevice} />
    )}
  </Composer>
));
