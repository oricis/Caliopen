import { normalizeLocation } from './';

describe('Service ApiLocation', () => {
  describe('normalizeLocation', () => {
    it('removes /api from the string', () => {
      expect(normalizeLocation('/api/foo/bar')).toEqual('/foo/bar');
    });

    it('removes /api from the begining of the string', () => {
      expect(normalizeLocation('/api/foo/api/bar/api')).toEqual('/foo/api/bar/api');
    });

    it('does not remove /api from the middle of the string', () => {
      expect(normalizeLocation('/foo/api/bar/api')).toEqual('/foo/api/bar/api');
    });
  });
});
