import { changeAuthorInParticipants } from './changeAuthorInParticipants';

describe('modules draftMessage - service - changeAuthorInParticipants', () => {
  const user = {
    contact: { contact_id: 'user-contact' },
  };

  it('has already user as author', () => {
    const participants = [
      { address: 'fry@planet-express.tld', contact_ids: ['user-contact'], protocol: 'email', type: 'From' },
      { address: 'zoidberg@planet-express.tld', contact_ids: ['t2'], protocol: 'email', type: 'To' },
      { address: 'leela@planet-express.tld', protocol: 'email', type: 'To' },
    ];
    expect(changeAuthorInParticipants({ participants, user })).toEqual(participants);
  });

  it('changes the author', () => {
    const participants = [
      { address: 'zoidberg@planet-express.tld', contact_ids: ['t2'], protocol: 'email', type: 'From' },
      { address: 'fry@planet-express.tld', contact_ids: ['user-contact'], protocol: 'email', type: 'To' },
      { address: 'leela@planet-express.tld', protocol: 'email', type: 'To' },
    ];
    expect(changeAuthorInParticipants({ participants, user })).toEqual([
      { ...participants[0], type: 'To' },
      { ...participants[1], type: 'From' },
      participants[2],
    ]);
  });

  it('has not identity anymore', () => {
    const participants = [
      { address: 'fry@old-address.example', protocol: 'email', type: 'To' },
      { address: 'zoidberg@planet-express.tld', contact_ids: ['t2'], protocol: 'email', type: 'From' },
      { address: 'leela@planet-express.tld', protocol: 'email', type: 'To' },
    ];
    expect(changeAuthorInParticipants({ participants, user })).toEqual([
      participants[0],
      { ...participants[1], type: 'To' },
      participants[2],
    ]);
  });

  it('has not participants', () => {
    const participants = undefined;
    expect(changeAuthorInParticipants({ participants, user })).toEqual(participants);
  });
});
