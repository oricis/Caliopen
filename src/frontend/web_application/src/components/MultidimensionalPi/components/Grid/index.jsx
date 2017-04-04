import React, { PropTypes } from 'react';

const Grid = ({ points, angle, gridWidth }) => {
  const axeLength = gridWidth / 2;
  const axeCoordinates = [];
  const polygonPoints = [];
  let count = 0;

  points.map((point) => {
    const axeName = point.name;
    const axeX = axeLength + (-axeLength * Math.sin((count * Math.PI) / 180));
    const axeY = axeLength + (-axeLength * Math.cos((count * Math.PI) / 180));
    axeCoordinates.push({ axeName, x: axeX, y: axeY });
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
          key={p.axeName}
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
  points: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};

export default Grid;
