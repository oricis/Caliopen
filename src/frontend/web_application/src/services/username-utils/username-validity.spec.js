import usernameValidity from './username-validity';

describe('services username-utils username-validity', () => {
  const unexpectedValid = () => expect(true).toBe(false);
  const expectTrue = res => expect(res).toBe(true);
  const expectOneError = res => expect(res.errors.length).toEqual(1);

  describe('isValid', () => {
    it('not valid under 3 characters & after 42 characters', async () => {
      try {
        await usernameValidity.isValid('aa');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }

      try {
        await usernameValidity.isValid('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
    });

    it('valid with 3 characters', async () => {
      let isValid = await usernameValidity.isValid('aaa');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('a.b');
      expectTrue(isValid);
    });

    it('valid with alphabet', async () => {
      const isValid = await usernameValidity.isValid('thequickbrownfoxjumpsoverthelazydog');
      expectTrue(isValid);
    });

    it('valid with capital', async () => {
      let isValid = await usernameValidity.isValid('AbcD');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('ABCD');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('AbCd');
      expectTrue(isValid);
    });

    it('not valid with spaces', async () => {
      try {
        await usernameValidity.isValid('Ab cD');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('A bc D');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid(' AbcD ');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('Ab  cD');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
    });

    it('valid with some specials characters', async () => {
      let isValid = await usernameValidity.isValid('aa.b');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('b-b');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('été');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('test+à');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('❤κξαδιθροχ');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid('名無しの権兵衛');
      expectTrue(isValid);
      isValid = await usernameValidity.isValid(')-oꞁꞁǝH');
      expectTrue(isValid);
    });

    // XXX : requires better regex
    // it('not valid with unicode combining characters', async () => {
    //   try {
    //     await usernameValidity.isValid('e\u0301te\u0301'); // été
    //     unexpectedValid();
    //   } catch (e) {
    //     expectOneError(e);
    //   }
    // });

    it('not valid with starting & ending dot', async () => {
      try {
        await usernameValidity.isValid('.abcd');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abcd.');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
    });

    it('not valid with double dot', async () => {
      try {
        await usernameValidity.isValid('ab..cd');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
    });

    it('not valid with not compliant email local-part', async () => {
      try {
        await usernameValidity.isValid('abc"d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc@d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc`d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc:d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc;d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc<d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc>d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc[d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc]d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
      try {
        await usernameValidity.isValid('abc\\d');
        unexpectedValid();
      } catch (e) {
        expectOneError(e);
      }
    });
  });
});

export default usernameValidity;
