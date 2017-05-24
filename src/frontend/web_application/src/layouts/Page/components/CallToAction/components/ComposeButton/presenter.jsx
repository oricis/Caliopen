import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

const Presenter = ({ __, action, className }) => (
  <ActionButton action={action} className={className} icon="plus">{__('call-to-action.action.compose')}</ActionButton>
);

Presenter.propTypes = {
  __: PropTypes.func.isRequired,
  action: PropTypes.func,
  className: PropTypes.string,
};
Presenter.defaultProps = {
  action: undefined,
  className: undefined,
};

export default Presenter;
