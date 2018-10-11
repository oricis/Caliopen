export const PI_PROPERTIES = ['comportment', 'technic', 'context'];
export const getPiClass = (piAggregate) => {
  if (Number.isNaN(piAggregate)) return 'disabled-pi';

  if (piAggregate < 25) return 'ugly';
  if (piAggregate < 50) return 'bad';

  return piAggregate < 75 ? 'good' : 'super';
};

export const getAngles = () => {
  const piLength = PI_PROPERTIES.length;
  if (piLength === 0) {
    return 0;
  }

  return 360 / piLength;
};

export const getAveragePI = (pi) => {
  const piProps = PI_PROPERTIES;

  if (!pi) return NaN;

  return Math.round((piProps.reduce((acc, name) => acc + pi[name] || 0, 0)) / piProps.length);
};
