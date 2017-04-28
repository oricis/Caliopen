// XXX: unit test
/* eslint-disable max-len */
import recipients from './index';

describe('recipients', () => {
  const user = {
    contact_id: '96c87be6',
    name: 'leela@planet-express.company',
  };

  it('render one contact', () => {
    const discussion = {
      participants: [
        { type: 'To', contact_ids: ['96c87be6'], address: 'leela@planet-express.company' },
        { type: 'From', contact_ids: ['4db3d7c9'], address: 'fry@planet-express.company' },
      ],
    };

    expect(recipients({ discussion, user })).toEqual('fry@planet-express.company');
  });
  it('render four participants', () => {
    const discussion = {
      participants: [
        { type: 'To', contact_ids: ['96c87be6'], address: 'leela@planet-express.company' },
        { type: 'From', contact_ids: ['4db3d7c9'], address: 'fry@planet-express.company' },
        { type: 'To', contact_ids: ['azd32D32'], address: 'zoidberg@planet-express.company' },
        { type: 'To', contact_ids: ['lkzjl234'], address: 'bender@fabrica-robotica.company' },
        { type: 'To', contact_ids: ['xezni233'], address: 'farnsworth@planet-express.company' },
      ],
    };

    expect(recipients({ discussion, user }))
      .toEqual('fry@planet-express.company, zoidberg@planet-express.company, bender@fabrica-robotica.company, farnsworth@planet-express.company');
  });
  it('render three or more participants', () => {
    const discussion = {
      participants: [
        { type: 'To', contact_ids: ['96c87be6'], address: 'leela@planet-express.company' },
        { type: 'From', contact_ids: ['4db3d7c9'], address: 'fry@planet-express.company' },
        { type: 'To', contact_ids: ['azd32D32'], address: 'zoidberg@planet-express.company' },
        { type: 'To', contact_ids: ['lkzjl234'], address: 'bender@fabrica-robotica.company' },
        { type: 'To', contact_ids: ['xezni233'], address: 'farnsworth@planet-express.company' },
        { type: 'To', contact_ids: ['cnie435e'], address: 'amy@planet-express.company' },
      ],
    };

    expect(recipients({ discussion, user }))
      .toEqual('fry@planet-express.company, zoidberg@planet-express.company, bender@fabrica-robotica.company, + 2');
  });
});
