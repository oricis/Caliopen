import React, { PropTypes } from 'react';
import PiGraph from './components/PiGraph';
import Ratings from './components/Ratings';

import './style.scss';

const MultidimensionalPi = ({ pi, piMax }) => {
  const gridWidth = piMax * 2;
  const angle = (360 / pi.length);
  const piLevels = pi.map(p => p.level);
  const averagePi = (piLevels.reduce((a, b) => a + b, 0)) / piLevels.length;

  return (
    <div className="m-multidimensional-pi">
      <PiGraph
        gridWidth={gridWidth}
        pi={pi}
        angle={angle}
      />
      <Ratings
        pi={pi}
        piMax={piMax}
        averagePi={averagePi}
      />
    </div>
  );
};

MultidimensionalPi.propTypes = {
  pi: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  piMax: PropTypes.number.isRequired,
};
export default MultidimensionalPi;
