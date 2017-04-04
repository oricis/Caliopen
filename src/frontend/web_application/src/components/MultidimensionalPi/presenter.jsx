import React, { PropTypes } from 'react';
import Grid from './components/Grid';
import Polygon from './components/Polygon';

import './style.scss';

const Rating = ({ name, level }) => {
  const style = {
    width: `${level}%`,
  };

  return (
    <div className="m-multidimensional-pi__rating">
      <div className="m-multidimensional-pi__rating-name-col">
        <span className="m-multidimensional-pi__rating-name-label">{name}</span>
      </div>
      <div className="m-multidimensional-pi__rating-level-col">
        <div className="m-multidimensional-pi__rating-level" style={style}>
          <span className="m-multidimensional-pi__rating-level-label">{level}</span>
        </div>
      </div>
    </div>
  );
};

Rating.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
};

class MultidimensionalPi extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    piMax: PropTypes.number.isRequired, // max value for Pi
  };
  constructor(props) {
    super(props);
    this.state = {
      activePi: 'null',
    };
    this.handlePiClick = this.handlePiClick.bind(this);
  }

  handlePiClick(e) {
    const name = e.target.id;
    this.setState(prevState => ({
      ...prevState.props,
      activePi: name,
    }));
  }


  render() {
    const { points, piMax } = this.props;
    const gridWidth = piMax * 2;
    const angle = (360 / points.length);
    const viewBox = [0, 0, gridWidth, gridWidth];

    return (
      <div className="m-multidimensional-pi">
        <svg
          id="pi"

          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >

          <Polygon
            points={points}
            angle={angle}
            gridWidth={gridWidth}
            piClick={this.handlePiClick}
          />
          <Grid
            points={points}
            angle={angle}
            gridWidth={gridWidth}
          />
        </svg>
        <div className="m-multidimensional-pi__ratings">
          {points.map(p =>
            <Rating name={p.name} level={p.level} key={p.name} />
          )}
        </div>
      </div>
    );
  }
}

export default MultidimensionalPi;
