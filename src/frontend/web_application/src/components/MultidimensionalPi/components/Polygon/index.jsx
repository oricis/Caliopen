import React, { PropTypes } from 'react';

const Polygon = ({ pi, angle, gridWidth }) => {
  const axeLength = gridWidth / 2;
  const pointCoordinates = [];
  const polygonPoints = [];
  let count = 0;
  pi.map((p) => {
    const piName = p.name;
    const piLevel = p.level;
    const pointX = axeLength + (-piLevel * Math.sin((count * Math.PI) / 180));
    const pointY = axeLength + (-piLevel * Math.cos((count * Math.PI) / 180));
    pointCoordinates.push({ name: piName, level: piLevel, x: pointX, y: pointY });
    polygonPoints.push(pointX, pointY);
    count -= angle;
  });

  return (
    <polygon className="m-multidimensional-pi__polygon" points={polygonPoints.join(' ')} />
  );
};

Polygon.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};

export default Polygon;
