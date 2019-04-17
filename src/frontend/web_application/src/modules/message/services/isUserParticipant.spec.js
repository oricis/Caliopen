import { isUserParticipant } from './isUserParticipant';

describe('message module - services - isUserParticipant', () => {
  const user = {
    contact: {
      contact_id: 'john',
    },
  };

  it('unknown contact', () => {
    const participant = {
      type: 'From',
    };
    expect(isUserParticipant({ participant, user })).toEqual(false);
  });
  it('known contact', () => {
    const participant = {
      type: 'From',
      contact_ids: ['whatever'],
    };
    expect(isUserParticipant({ participant, user })).toEqual(false);
  });
  it('is actually the user', () => {
    const participant = {
      type: 'From',
      contact_ids: ['john'],
    };
    expect(isUserParticipant({ participant, user })).toEqual(true);
  });
});
