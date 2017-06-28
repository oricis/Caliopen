export const getPiProps = pi => Object.keys(pi).filter(key => key !== 'version');

export const getAngles = (pi) => {
  const piLength = getPiProps(pi).length;
  if (piLength === 0) {
    return 0;
  }

  return 360 / piLength;
};

export const getAveragePI = (pi) => {
  const piProps = getPiProps(pi);

  return (piProps.reduce((acc, name) => acc + pi[name], 0)) / piProps.length;
};
