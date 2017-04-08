import reducer, * as module from './message';

describe('ducks module message', () => {
  describe('reducer', () => {
    it('reduces SYNC_MESSAGE', () => {
      const initialState = reducer(undefined, { type: '@@INIT' });
      const message = { body: 'foo', message_id: '111', discussion_id: 'a111' };
      expect(reducer(undefined, module.syncMessage({ message }))).toEqual({
        ...initialState,
        messagesById: {
          111: message,
        },
      });
    });
  });
});
