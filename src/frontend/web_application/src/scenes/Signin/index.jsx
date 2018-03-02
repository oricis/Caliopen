import React from 'react';
import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import Composer from 'react-composer';
import Presenter from './presenter';
import { withInitSettings } from '../../modules/settings';
import { WithDevice } from '../../modules/device';

export default compose(
  withI18n(),
  withInitSettings(),
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
