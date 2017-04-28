import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

export const RawButton = ({ children, type = 'button', ...props }) => {
  const buttonProps = {
    ...props,
    type,
  };

  return <button {...buttonProps}>{children}</button>;
};

RawButton.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  children: PropTypes.node.isRequired,
};

const Button = ({
  children, className, expanded, plain, hollow, inline,
  active = false, alert, success, secondary, ...props
}) => {
  const buttonProps = {
    ...props,
    className: classnames(
      className,
      'm-button',
      {
        'm-button--alert': alert,
        'm-button--alert-plain': alert && plain,
        'm-button--success': success,
        'm-button--secondary': secondary,
        'm-button--secondary-plain': secondary && plain,
        'm-button--expanded': expanded,
        'm-button--plain': plain && !secondary && !alert,
        'm-button--hollow': hollow,
        'm-button--active': active,
        'm-button--inline': inline,
      }
    ),
  };

  return <RawButton {...buttonProps}>{children}</RawButton>;
};

Button.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  hollow: PropTypes.bool,
  expanded: PropTypes.bool,
  active: PropTypes.bool,
  alert: PropTypes.bool,
  inline: PropTypes.bool,
  success: PropTypes.bool,
  secondary: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Button;
