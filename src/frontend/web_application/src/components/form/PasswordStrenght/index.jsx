import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../../../components/Icon';
import './style.scss';

const PasswStrenght = ({ strenght, className }) => {
  const passwordStrenghtClassName = classnames(
    'm-passw-strenght',
    {
      'm-passw-strenght--weak': strenght === 'weak',
      'm-passw-strenght--moderate': strenght === 'moderate',
      'm-passw-strenght--strong': strenght === 'strong',
    },
    className
  );

  return (
    <div className={passwordStrenghtClassName}>
      <Icon type="lock" />
      <div className="passwGuide" />
    </div>
  );
};

PasswStrenght.propTypes = {
  strenght: PropTypes.string,
  className: PropTypes.string,
};

export default PasswStrenght;
