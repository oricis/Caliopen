import { isMessageFromUser } from './index';

describe('message services', () => {
  const user = {
    contact: {
      contact_id: 'john',
    },
  };

  describe('isMessageFromUser', () => {
    it('unknown contact', () => {
      const message = {
        participants: [{
          type: 'From',
        }],
      };
      expect(isMessageFromUser(message, user)).toEqual(false);
    });

    it('known contact', () => {
      const message = {
        participants: [{
          type: 'From',
          contact_ids: ['whatever'],
        }],
      };
      expect(isMessageFromUser(message, user)).toEqual(false);
    });

    it('is actually the user', () => {
      const message = {
        participants: [{
          type: 'From',
          contact_ids: ['john'],
        }],
      };
      expect(isMessageFromUser(message, user)).toEqual(true);
    });
  });
});
