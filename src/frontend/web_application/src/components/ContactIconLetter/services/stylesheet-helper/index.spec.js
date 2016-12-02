import { getContactStylesheetClass } from './index';

describe('Service Helper StylesheetHelper', () => {
  describe('getContactStylesheetClass', () => {
    it('make stylesheet class from standard letter', () => {
      expect(getContactStylesheetClass({ title: 'fry' })).toEqual('m-letter--f');
    });

    it('make stylesheet class from non-standard letter', () => {
      expect(getContactStylesheetClass({ title: 'ß-Ligatur' }))
        .toEqual('m-letter--none');
    });
  });
});
