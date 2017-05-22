import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const Rating = ({ name, level, piMax, className, mini }) => {
  const width = (level / piMax) * 100;
  const style = { width: `${width}%` };

  return (
    <div className={classnames('m-pi-ratings__item', { 'm-pi-ratings--mini__item': mini }, className)}>
      <div className={classnames('m-pi-ratings__item-name', { 'm-pi-ratings--mini__item-name': mini })}>
        <span className={classnames('m-pi-ratings__item-name-label', { 'm-pi-ratings--mini__item-name-label': mini })}>{name}</span>
      </div>
      <div className={classnames('m-pi-ratings__item-level', { 'm-pi-ratings--mini__item-level': mini })}>
        <div className={classnames('m-pi-ratings__item-level-bar', { 'm-pi-ratings--mini__item-level-bar': mini })} style={style} />
      </div>
      <div className={classnames('m-pi-ratings__item-level-label', { 'm-pi-ratings--mini__item-level-label': mini })}>{level}</div>
    </div>
  );
};

Rating.propTypes = {
  name: PropTypes.string.isRequired,
  mini: PropTypes.bool,
  className: PropTypes.string,
  level: PropTypes.number.isRequired,
  piMax: PropTypes.number.isRequired,
};

Rating.defaultProps = {
  className: '',
  mini: false,
};

const Ratings = ({ pi, piMax, averagePi, displayAveragePi, mini }) => {
  const ratingsClassName = classnames(
    'm-pi-ratings',
    { 'm-pi-ratings--mini': mini },
  );

  return (
    <div className={ratingsClassName} title={pi.map(p => ` ${p.name}: ${p.level}`)}>
      {displayAveragePi &&
        <Rating
          className="m-pi-ratings__item--average"
          name="Average PI"
          level={Math.round(averagePi)}
          piMax={piMax}
          mini={mini}
        />
      }
      {pi.map(p =>
        <Rating
          name={p.name}
          level={p.level <= piMax ? p.level : piMax}
          key={p.name}
          piMax={piMax}
          mini={mini}
        />
      )}
    </div>
  );
};

Ratings.defaultProps = {
  displayAveragePi: false,
  mini: false,
  averagePi: null,
};
Ratings.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  piMax: PropTypes.number.isRequired,
  displayAveragePi: PropTypes.bool,
  mini: PropTypes.bool,
  averagePi: PropTypes.number,
};


export default Ratings;
