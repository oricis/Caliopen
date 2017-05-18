import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const Rating = ({ name, level, piMax, className }) => {
  const width = (level / piMax) * 100;
  const style = { width: `${width}%` };
  const ratingClassName = classnames(
    'm-pi-ratings__item',
    className,
  );

  return (
    <div className={ratingClassName}>
      <div className="m-pi-ratings__item-name">
        <span className="m-pi-ratings__item-name-label">{name}</span>
      </div>
      <div className="m-pi-ratings__item-level">
        <div className="m-pi-ratings__item-level-bar" style={style} />
      </div>
      <div className="m-pi-ratings__item-level-label">{level}</div>
    </div>
  );
};

Rating.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  level: PropTypes.number.isRequired,
  piMax: PropTypes.number.isRequired,
};

Rating.defaultProps = {
  className: '',
};

const Ratings = ({ pi, piMax, averagePi, displayAveragePi, mini }) => {
  const ratingsClassName = classnames(
    'm-pi-ratings',
    { 'm-pi-ratings--mini': mini },
  );

  return (
    <div className={ratingsClassName}>
      {displayAveragePi &&
        <Rating
          className="m-pi-ratings__item--average"
          name="Average PI"
          level={Math.round(averagePi)}
          piMax={piMax}
        />
      }
      {pi.map(p =>
        <Rating
          name={p.name}
          level={p.level <= piMax ? p.level : piMax}
          key={p.name}
          piMax={piMax}
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
