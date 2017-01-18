import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../../../components/Icon';
import './style.scss';

const PasswordStrength = ({ strength, className }) => {
  const passwordStrengthClassName = classnames(
    'm-password-strength',
    {
      'm-password-strength--weak': strength === 'weak',
      'm-password-strength--moderate': strength === 'moderate',
      'm-password-strength--strong': strength === 'strong',
    },
    className
  );

  return (
    <div className={passwordStrengthClassName}>
      <div className="m-password-strength__graph">
        <Icon type="lock" className="m-password-strength__icon" />
        <div className="m-password-strength__guide">
          <div className="m-password-strength__bar" />
        </div>
      </div>
      <span className="m-password-strength__text">This password is { strength }</span>
    </div>
  );
};

PasswordStrength.propTypes = {
  strength: PropTypes.string,
  className: PropTypes.string,
};

export default PasswordStrength;
