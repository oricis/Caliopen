import { getAngles, getAveragePI, PI_PROPERTIES } from './';

describe('MultidimensionalPi > services > pi', () => {
  describe('getAngles', () => {
    it('gives 360 / 3 or n props', () => {
      expect(getAngles()).toEqual(360 / PI_PROPERTIES.length);
    });
  });
  describe('getAveragePI', () => {
    it('gives a basic avarage value', () => {
      expect(getAveragePI({
        comportment: 5,
        technic: 10,
        context: 15,
        rab: 20,
        version: 1,
      })).toEqual((5 + 10 + 15) / 3);
    });
  });
});
