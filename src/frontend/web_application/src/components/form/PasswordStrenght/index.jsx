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
      <div className="m-passw-strenght__row m-passw-strenght__graph">
        <Icon type="lock" />
        <div className="m-passw-strenght__guide">
          <div className="m-passw-strenght__bar" />
        </div>
      </div>
      <div className="m-passw-strenght__row">
        <span className="m-passw-strenght__text">Password strengh is { strenght }</span>
      </div>
    </div>
  );
};

PasswStrenght.propTypes = {
  strenght: PropTypes.string,
  className: PropTypes.string,
};

export default PasswStrenght;
