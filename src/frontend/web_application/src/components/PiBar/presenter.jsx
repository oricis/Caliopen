import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../../components/Icon';
import './style.scss';


const PiBar = ({ level, className }) => {
  const classNameModifiers = {
    ugly: 'm-pi-bar--ugly',
    bad: 'm-pi-bar--bad',
    good: 'm-pi-bar--good',
    super: 'm-pi-bar--super',
  };

  let key;
  switch (true) {
    default:
    case level <= 20:
      key = 'ugly';
      break;
    case level > 20 && level <= 50:
      key = 'bad';
      break;
    case level > 50 && level <= 75:
      key = 'good';
      break;
    case level > 75:
      key = 'super';
      break;
  }

  const barStyle = {
    width: `${level}%`,
  };

  const piBarClassName = classnames(
    'm-pi-bar',
    classNameModifiers[key],
    className
  );

  return (
    <div className={piBarClassName}>
      <div className="m-pi-bar__graph">
        <Icon type="shield" className="m-pi-bar__icon" />
        <div className="m-pi-bar__guide">
          <div className="m-pi-bar__bar" style={barStyle} />
        </div>
        <div className="m-pi-bar__level">{level}</div>
      </div>
    </div>
  );
};

PiBar.propTypes = {
  level: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PiBar;
