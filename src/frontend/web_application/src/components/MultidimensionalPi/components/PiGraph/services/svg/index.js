import { getPiProps, getAngles } from '../../../../services/pi';

export function calcXpoint(level, tilt, axeLength) {
  return Math.round(axeLength - (level * Math.sin((tilt * Math.PI) / 180)));
}

export function calcYpoint(level, tilt, axeLength) {
  return Math.round(axeLength - (level * Math.cos((tilt * Math.PI) / 180)));
}

export const calcGridCoordinates = ({ pi, axeLength }) => {
  const angle = getAngles(pi);
  const axeCoordinates = [];
  const outlinePoints = [];
  let tilt = 0;

  getPiProps(pi).forEach((axeName) => {
    const pointX = calcXpoint(axeLength, tilt, axeLength);
    const pointY = calcYpoint(axeLength, tilt, axeLength);
    outlinePoints.push(pointX, pointY);
    axeCoordinates.push({ axeName, x: pointX, y: pointY });
    tilt -= angle;
  });

  return { axeCoordinates, outlinePoints };
};

export const calcPolygonPoints = ({ pi, axeLength }) => {
  const angle = getAngles(pi);
  const polygonPoints = [];
  let tilt = 0;
  getPiProps(pi).forEach((name) => {
    const piLevel = pi[name];

    polygonPoints.push(
      calcXpoint(piLevel, tilt, axeLength),
      calcYpoint(piLevel, tilt, axeLength)
    );
    tilt -= angle;
  });

  return polygonPoints;
};
