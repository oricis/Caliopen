//--------------
// func à tester
// import { Polygon } from './';

const AXE_LENGTH = 100;

export function calcXpoint(level, tilt) {
  return AXE_LENGTH - (level * Math.sin((tilt * Math.PI) / 180));
}
export function calcYpoint(level, tilt) {
  return AXE_LENGTH - (level * Math.cos((tilt * Math.PI) / 180));
}

export function getPolygonPoints(pi) {
  if (pi.length === 0) {
    const err = 'pi should contains values';
    throw err;
  }

  const angle = 360 / pi.length;
  const polygonPoints = [];
  let tilt = 0;
  pi.forEach((p) => {
    const piLevel = p.level;
    polygonPoints.push(
      calcXpoint(piLevel, tilt),
      calcYpoint(piLevel, tilt)
    );
    tilt -= angle;
  });

  return polygonPoints.join(' ');
}
//----------

describe('comp PiGraph', () => {
  describe('getPolygonPoints', () => {
    it('returns normal values', () => {
      const result = getPolygonPoints([
        { name: 'foo', level: 80 },
        { name: 'bar', level: 50 },
        { name: 'oof', level: 10 },
      ]);

      const expected = `${calcXpoint(80, 0)} ${calcYpoint(80, 0)} ${calcXpoint(50, -120)} ${calcYpoint(50, -120)} ${calcXpoint(10, -240)} ${calcYpoint(10, -240)}`;

      expect(result).toEqual(expected);
    });

    it('what happens when no values ?????', () => {
      expect(() => {
        getPolygonPoints([]);
      }).toThrow();
    });
  });
});
