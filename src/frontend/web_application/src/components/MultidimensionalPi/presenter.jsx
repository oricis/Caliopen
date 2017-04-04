import React, { PropTypes } from 'react';
import Grid from './components/Grid';
import Polygon from './components/Polygon';

import './style.scss';

const Rating = ({ name, level, piMax }) => {
  const width = (level / piMax) * 100;
  const style = {
    width: `${width}%`,
  };

  return (
    <div className="m-multidimensional-pi__rating">
      <div className="m-multidimensional-pi__rating-name-col">
        <span className="m-multidimensional-pi__rating-name-label">{name}</span>
      </div>
      <div className="m-multidimensional-pi__rating-level-col">
        <div className="m-multidimensional-pi__rating-level" style={style} />
      </div>
      <div className="m-multidimensional-pi__rating-level-label">{level}/{piMax}</div>
    </div>
  );
};

Rating.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  piMax: PropTypes.number.isRequired,
};

class MultidimensionalPi extends React.Component {
  static propTypes = {
    pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    piMax: PropTypes.number.isRequired, // max value for Pi
  };

  render() {
    const { pi, piMax } = this.props;
    const gridWidth = piMax * 2;
    const angle = (360 / pi.length);
    const viewBox = [0, 0, gridWidth, gridWidth];

    return (
      <div className="m-multidimensional-pi">
        <svg
          id="pi"
          className="m-multidimensional-pi__pi"
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          <Polygon
            pi={pi}
            angle={angle}
            gridWidth={gridWidth}
            piClick={this.handlePiClick}
            className="m-multidimensional-pi__pi"
          />
          <Grid
            pi={pi}
            angle={angle}
            gridWidth={gridWidth}
          />
        </svg>
        <div className="m-multidimensional-pi__ratings">
          {pi.map(p =>
            <Rating name={p.name} level={p.level} key={p.name} piMax={piMax} />
          )}
        </div>
      </div>
    );
  }
}

export default MultidimensionalPi;
