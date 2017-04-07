import React, { PropTypes } from 'react';
import './style.scss';

const Grid = ({ pi, angle, axeLength }) => {
  const axeCoordinates = [];
  const polygonPoints = [];
  let count = 0;

  pi.map((p) => {
    const axeName = p.name;
    const axeX = axeLength - (axeLength * Math.sin((count * Math.PI) / 180));
    const axeY = axeLength - (axeLength * Math.cos((count * Math.PI) / 180));
    axeCoordinates.push({ axeName, x: axeX, y: axeY });
    polygonPoints.push(axeX, axeY);
    count -= angle;
  });

  return (
    <g className="m-pi-graph__grid">
      <polygon className="m-pi-graph__outline" points={polygonPoints.join(' ')} />
      {axeCoordinates.map(p =>
        <line
          key={p.axeName}
          className="m-pi-graph__line"
          id={p.axeName}
          x1={axeLength}
          y1={axeLength}
          x2={p.x}
          y2={p.y}
        />
      )}
    </g>
  );
};

Grid.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  axeLength: PropTypes.number.isRequired,
};

const Polygon = ({ pi, angle, axeLength }) => {
  const polygonPoints = [];
  let count = 0;
  pi.map((p) => {
    const piLevel = p.level;
    const pointX = axeLength - (piLevel * Math.sin((count * Math.PI) / 180));
    const pointY = axeLength - (piLevel * Math.cos((count * Math.PI) / 180));
    polygonPoints.push(pointX, pointY);
    count -= angle;
  });

  return (
    <polygon
      className="m-pi-graph__shape"
      points={polygonPoints.join(' ')}
    />
  );
};

Polygon.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  axeLength: PropTypes.number.isRequired,
};

const PiGraph = ({ pi, angle, gridWidth }) => {
  const viewBox = [0, 0, gridWidth, gridWidth];
  const axeLength = gridWidth / 2;

  return (
    <svg
      id="pi"
      className="m-pi-graph"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Polygon
        pi={pi}
        angle={angle}
        axeLength={axeLength}
      />
      <Grid
        pi={pi}
        angle={angle}
        axeLength={axeLength}
      />
    </svg>
  );
};

PiGraph.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  angle: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
};

export default PiGraph;
