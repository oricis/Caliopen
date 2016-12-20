import React, { PropTypes } from 'react';
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
  children, className, expanded, plain, hollow, active = false, alert, ...props
}) => {
  const buttonProps = {
    ...props,
    className: classnames(
      className,
      'm-button',
      {
        'm-button--alert': alert,
        'm-button--expanded': expanded,
        'm-button--plain': plain,
        'm-button--hollow': hollow,
        'm-button--active': active,
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
  children: PropTypes.node.isRequired,
};

export default Button;
