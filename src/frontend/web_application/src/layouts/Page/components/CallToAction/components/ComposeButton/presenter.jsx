import React from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';
import ActionButton from '../ActionButton';
import Icon from '../../../../../../components/Icon';

const Presenter = ({ translator: { __ }, ...props }) => (
  <ActionButton {...props}>
    <Icon type="plus" /> {__('call-to-action.action.compose')}
  </ActionButton>
);

Presenter.propTypes = {
  translator: PropTypes.shape({ __: PropTypes.func.isRequired }),
};

export default withTranslator({ propsNamespace: 'translator' })(Presenter);
