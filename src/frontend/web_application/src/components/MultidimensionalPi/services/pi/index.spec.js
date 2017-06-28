import { getAngles, getAveragePI } from './';

describe('MultidimensionalPi > services > pi', () => {
  describe('getAngles', () => {
    it('gives 90° for 4 points', () => {
      expect(getAngles({
        foo: 5,
        bar: 10,
        oof: 15,
        rab: 20,
        version: 1,
      })).toEqual(90);
    });
    it('gives 0 for no points', () => {
      expect(getAngles({
        version: 1,
      })).toEqual(0);
    });
  });
  describe('getAveragePI', () => {
    it('gives a basic avarage value', () => {
      expect(getAveragePI({
        foo: 5,
        bar: 10,
        oof: 15,
        rab: 20,
        version: 1,
      })).toEqual((5 + 10 + 15 + 20) / 4);
    });
  });
});
