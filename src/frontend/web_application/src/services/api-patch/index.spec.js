import calcObjectForPatch from './index';

describe('Service calcObjectForPatch', () => {
  describe('update simple fields', () => {
    it('give infos from name', () => {
      const previous = { foo: 'bar' };
      const updated = { foo: 'foo' };

      expect(calcObjectForPatch(updated, previous)).toEqual({
        foo: 'foo',
        current_state: {
          foo: 'bar',
        },
      });
    });
  });

  describe('update sub-object', () => {
    it('does not update sub-object clone', () => {
      const previous = { foo: { value: 'bar' } };
      const updated = { ...previous, foo: { ...previous.foo } };

      expect(calcObjectForPatch(updated, previous)).toEqual({
        current_state: {},
      });
    });
  });
});
