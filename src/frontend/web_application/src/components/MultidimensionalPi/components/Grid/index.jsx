import React, { PropTypes } from 'react';

const Grid = ({ pi, angle, gridWidth }) => {
  const axeLength = gridWidth / 2;
  const axeCoordinates = [];
  const polygonPoints = [];
  let count = 0;

  pi.map((p) => {
    const axeName = p.name;
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
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};

export default Grid;
