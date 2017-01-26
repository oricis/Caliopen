import usernameValidity from './username-validity';

describe('services username-utils username-validity', () => {
  describe('isValid', () => {
    it('valid with 3 characters', () => {
      expect(usernameValidity.isValid('aaa')).toBe(true);
    });

    it('valid with alphabet', () => {
    });

    it('valid with capital', () => {
      expect(usernameValidity.isValid('AbcD')).toBe(true);
    });

    it('valid with some specials characters', () => {
      expect(usernameValidity.isValid('aa.b')).toBe(true);
      expect(usernameValidity.isValid('b-b')).toBe(true);
      expect(usernameValidity.isValid('été')).toBe(true);
    });

    it('not valid with starting & ending dot', () => {
      expect(usernameValidity.isValid('.abcd')).toBe(false);
      expect(usernameValidity.isValid('abcd.')).toBe(false);
    });

    it('TODO: to fix', () => {
      // capital
      expect(usernameValidity.isValid('ABCD')).toBe(true);
      expect(usernameValidity.isValid('AbCd')).toBe(true);
      // alphabet : k m p are invalids
      expect(usernameValidity.isValid('thequickbrownfoxjumpsoverthelazydog')).toBe(true);
      // special characters
      expect(usernameValidity.isValid('a.b')).toBe(true);
    });
  });
});

export default usernameValidity;
