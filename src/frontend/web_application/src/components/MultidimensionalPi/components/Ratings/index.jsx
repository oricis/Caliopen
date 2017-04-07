import React, { PropTypes } from 'react';
import './style.scss';

const Rating = ({ name, level, piMax }) => {
  const width = (level / piMax) * 100;
  const style = { width: `${width}%` };

  return (
    <div className="m-pi-ratings__item">
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
  name: PropTypes.string,
  level: PropTypes.number.isRequired,
  piMax: PropTypes.number.isRequired,
};

Rating.defaultProps = {
  name: '',
};

const Ratings = ({ pi, piMax, averagePi }) => (
  <div className="m-pi-ratings">
    <Rating name="Average PI" level={Math.round(averagePi)} piMax={piMax} />
    <br />
    {pi.map(p =>
      <Rating name={p.name} level={p.level} key={p.name} piMax={piMax} />
    )}

  </div>
);

Ratings.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  piMax: PropTypes.number.isRequired,
  averagePi: PropTypes.number.isRequired,
};

export default Ratings;
