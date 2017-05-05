import React, { PropTypes } from 'react';
import classnames from 'classnames';
import PiGraph from './components/PiGraph';
import Ratings from './components/Ratings';

const PI_MAX = 100; // max value for PI levels

const MultidimensionalPi = ({ pi, displayAveragePi, className }) => {
  const gridWidth = PI_MAX * 2;
  const piLength = pi.length;
  const angle = 360 / piLength;
  const piLevels = pi.map(p => p.level);
  const averagePi = (piLevels.reduce((a, b) => a + b, 0)) / piLength;

  return (
    <div className={classnames('m-multidimensional-pi', className)}>
      <PiGraph
        gridWidth={gridWidth}
        piMax={PI_MAX}
        pi={pi}
        angle={angle}
      />
      <Ratings
        pi={pi}
        piMax={PI_MAX}
        averagePi={averagePi}
        displayAveragePi={displayAveragePi}
      />
    </div>
  );
};
MultidimensionalPi.defaultProps = {
  displayAveragePi: false,
  className: null,
};
MultidimensionalPi.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  className: PropTypes.string,
  displayAveragePi: PropTypes.bool,
};
export default MultidimensionalPi;
