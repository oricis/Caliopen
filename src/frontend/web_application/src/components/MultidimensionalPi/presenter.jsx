import React, { PropTypes } from 'react';
import './style.scss';

const Grid = ({ points, angle, gridWidth }) => {
  const axeLength = gridWidth / 2;
  const axeCoordinates = [];
  const polygonPoints = [];
  let count = 0;

  points.map((point) => {
    const axeX = axeLength + (axeLength * Math.sin((count * Math.PI) / 180));
    const axeY = axeLength + (axeLength * Math.cos((count * Math.PI) / 180));
    axeCoordinates.push({ x: axeX, y: axeY });
    polygonPoints.push(axeX, axeY);
    count -= angle;
  });

  return (
    <g className="m-multidimensional-pi__grid">
      <polygon
        className="m-multidimensional-pi__grid-polygon"
        points={polygonPoints.join(' ')}
      />
      {axeCoordinates.map(p =>
        <line
          className="m-multidimensional-pi__grid-line"
          x1={axeLength}
          y1={axeLength}
          x2={p.x}
          y2={p.y}
        />)
      }
    </g>
  );
};

Grid.propTypes = {
  points: PropTypes.shape({}).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};


const Polygon = ({ points, angle, piClick, gridWidth }) => {
  const axeLength = gridWidth / 2;
  const pointCoordinates = [];
  const polygonPoints = [];
  let count = 0;
  points.map((point) => {
    const pointName = point.name;
    const pointPi = point.pi;
    const pointX = axeLength + (pointPi * Math.sin((count * Math.PI) / 180));
    const pointY = axeLength + (pointPi * Math.cos((count * Math.PI) / 180));
    pointCoordinates.push({ name: pointName, pi: pointPi, x: pointX, y: pointY });
    polygonPoints.push(pointX, pointY);
    count -= angle;
  });

  return (
    <g>
      <polygon className="m-multidimensional-pi__polygon" points={polygonPoints.join(' ')} />
      {pointCoordinates.map(p =>
        <g>
          <title>{p.name} PI = {p.pi}</title>
          <circle
            key={p.name}
            className="m-multidimensional-pi__point"
            r={3}
            cx={p.x}
            cy={p.y}
            id={p.name}
            onClick={piClick}
          />
        </g>
       )}
    </g>
  );
};

Polygon.propTypes = {
  piClick: PropTypes.func.isRequired,
  points: PropTypes.shape({}).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};


class MultidimensionalPi extends React.Component {
  static propTypes = {
    points: PropTypes.shape({}).isRequired,
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
      <svg
        id="pi"
        className="m-multidimensional-pi"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <Grid
          points={points}
          angle={angle}
          gridWidth={gridWidth}
        />

        <Polygon
          points={points}
          angle={angle}
          gridWidth={gridWidth}
          piClick={this.handlePiClick}
        />
      </svg>
    );
  }
}

export default MultidimensionalPi;
