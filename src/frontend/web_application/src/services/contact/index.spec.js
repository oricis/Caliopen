import * as contactService from './index';

describe('contact services', () => {
  describe('getFirstLetter', () => {
    it('get an alpha letter', () => {
      expect(contactService.getFirstLetter('foobar', '+')).toEqual('f');
    });

    it('default letter is mandatory', () => {
      expect(contactService.getFirstLetter('^azdjhk')).toEqual(undefined);
    });

    it('get the default letter for a special character', () => {
      expect(contactService.getFirstLetter('↓azdazdþ', '+')).toEqual('+');
    });
  });

  describe('formatName', () => {
    const contact = {
      title: 'J.D.',
      given_name: 'John',
      family_name: 'Doe',
    };

    it('extract a simple property', () => {
      expect(contactService.formatName({ contact, format: 'title' })).toEqual(contact.title);
    });

    it('extract properties separated by a comma', () => {
      expect(contactService.formatName({ contact, format: 'given_name, family_name' })).toEqual('John Doe');
    });
  });
});
