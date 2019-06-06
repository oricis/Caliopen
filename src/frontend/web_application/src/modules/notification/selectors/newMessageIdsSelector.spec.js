import { newMessageIdsSelector } from './newMessageIdsSelector';

describe('modules notification - selectors newMessageIdsSelector', () => {
  it('selects', () => {
    expect(newMessageIdsSelector({
      notification: {
        notifications: [
          {
            type: 'event',
            emitter: 'smtp',
            body: '{"emailReceived": "001"}',
          },
        ],
      },
      message: {
        messagesById: {},
      },
    })).toEqual(['001']);
  });
});
