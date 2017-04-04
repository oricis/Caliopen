import React, { PropTypes } from 'react';

const Polygon = ({ points, angle, gridWidth }) => {
  const axeLength = gridWidth / 2;
  const pointCoordinates = [];
  const polygonPoints = [];
  let count = 0;
  points.map((point) => {
    const pointName = point.name;
    const pointPi = point.level;
    const pointX = axeLength + (-pointPi * Math.sin((count * Math.PI) / 180));
    const pointY = axeLength + (-pointPi * Math.cos((count * Math.PI) / 180));
    pointCoordinates.push({ name: pointName, level: pointPi, x: pointX, y: pointY });
    polygonPoints.push(pointX, pointY);
    count -= angle;
  });

  return (
    <polygon className="m-multidimensional-pi__polygon" points={polygonPoints.join(' ')} />
  );
};

Polygon.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};

export default Polygon;
