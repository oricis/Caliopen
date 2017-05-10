import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';

import './style.scss';

export const RawButton = ({ children, type, ...props }) => {
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

RawButton.defaultProps = {
  type: 'button',
};

const Button = ({ children, className, icon, display, color, shape, ...props }) => {
  const buttonProps = {
    ...props,
    className: classnames(
      className,
      'm-button',
      {
        'm-button--active': color === 'active',
        'm-button--alert': color === 'alert',
        'm-button--disabled': color === 'disabled',
        'm-button--secondary': color === 'secondary',
        'm-button--success': color === 'success',

        'm-button--expanded': display === 'expanded',
        'm-button--inline': display === 'inline',

        'm-button--plain': shape === 'plain',
        'm-button--hollow': shape === 'hollow',

        'm-button--icon': icon,
      }
    ),
  };

  if (icon) return <RawButton {...buttonProps}><Icon className="m-button__icon" type={icon} /><span className="m-button__text">{children}</span></RawButton>;

  return <RawButton {...buttonProps}>{children}</RawButton>;
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  shape: PropTypes.oneOf(['plain', 'hollow']),
  icon: PropTypes.string,
  display: PropTypes.oneOf(['inline', 'expanded']),
  color: PropTypes.oneOf(['success', 'alert', 'secondary', 'active', 'disabled']),
  accesskey: PropTypes.string,
};

Button.defaultProps = {
  className: undefined,
  shape: null,
  icon: null,
  display: null,
  color: null,
  accesskey: null,
};

export default Button;
