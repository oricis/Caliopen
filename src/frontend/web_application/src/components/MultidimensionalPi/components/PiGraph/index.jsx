import React, { PropTypes } from 'react';
import './style.scss';


function calcXpoint(level, tilt, axeLength) {
  return Math.round(axeLength - (level * Math.sin((tilt * Math.PI) / 180)));
}
function calcYpoint(level, tilt, axeLength) {
  return Math.round(axeLength - (level * Math.cos((tilt * Math.PI) / 180)));
}

const Grid = ({ pi, angle, axeLength }) => {
  const axeCoordinates = [];
  const outlinePoints = [];
  let tilt = 0;
  pi.forEach((p) => {
    const axeName = p.name;
    const pointX = calcXpoint(axeLength, tilt, axeLength);
    const pointY = calcYpoint(axeLength, tilt, axeLength);
    outlinePoints.push(pointX, pointY);
    axeCoordinates.push({ axeName, x: pointX, y: pointY });
    tilt -= angle;
  });

  return (
    <g className="m-pi-graph__grid">
      <polygon
        className="m-pi-graph__outline"
        points={outlinePoints.join(' ')}
      />
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
  let tilt = 0;
  pi.forEach((p) => {
    const piLevel = p.level;
    polygonPoints.push(
      calcXpoint(piLevel, tilt, axeLength),
      calcYpoint(piLevel, tilt, axeLength)
    );
    tilt -= angle;
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
