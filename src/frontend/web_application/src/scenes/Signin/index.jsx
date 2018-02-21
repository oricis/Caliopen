import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import Composer from 'react-composer';
import Presenter from './presenter';
import { withInitSettings } from '../../modules/settings';
import { WithDevice, saveDevice } from '../../modules/device';

const mapDispatchToProps = dispatch => bindActionCreators({
  saveDevice,
}, dispatch);

export default compose(
  withI18n(),
  withInitSettings(),
  connect(null, mapDispatchToProps)
)(props => (
  <Composer
    components={[
      <WithDevice />,
    ]}
    renderPropName="render"
  >
    {([{ clientDevice, requestDevice }]) => (
      <Presenter {...props} clientDevice={clientDevice} requestDevice={requestDevice} />
    )}
  </Composer>
));
