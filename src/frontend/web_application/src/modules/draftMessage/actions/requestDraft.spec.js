import configureMockStore from 'redux-mock-store';
import promiseMiddleware from '../../../store/middlewares/promise-middleware';
import thunkMiddleware from '../../../store/middlewares/thunk-middleware';
import { requestDraft } from './requestDraft';
import { requestDraft as requestDraftBase, requestDraftSuccess, createDraft } from '../../../store/modules/draft-message';

const mockStore = configureMockStore([promiseMiddleware, thunkMiddleware]);
const getStore = () => mockStore({
  message: {
    messagesById: {},
  },
  draftMessage: {
    draftsByInternalId: {
    },
  },
});
jest.mock('../../message', () => {
  const actualModule = jest.requireActual('../../message');

  return {
    ...actualModule,
    getDraft: ({ discussionId }) => (dispatch) => {
      dispatch({ type: 'getDraft', payload: { discussionId } });

      switch (discussionId) {
        case '01':
          return Promise.resolve({
            message_id: 'bar',
            discussion_id: '01',
            is_draft: true,
          });
        default:
          return Promise.resolve(undefined);
      }
    },
    getLastMessage: ({ discussionId }) => (dispatch) => {
      dispatch({ type: 'getLastMessage', payload: { discussionId } });

      switch (discussionId) {
        case '02':
          return Promise.resolve({
            message_id: 'last-msg',
            discussion_id: '02',
            subject: 'Parent msg subject',
            is_draft: false,
            type: 'email',
          });
        case '03':
          return Promise.resolve({
            message_id: 'twitter-msg',
            discussion_id: '03',
            is_draft: false,
            type: 'twitter',
          });
        default:
          return Promise.resolve(undefined);
      }
    },
    getMessage: ({ messageId }) => (dispatch) => {
      dispatch({ type: 'getMessage', payload: { messageId } });

      switch (messageId) {
        case 'saved':
          return Promise.resolve({
            message_id: messageId,
            body: 'saved draft',
            type: 'email',
          });
        case 'twitter-msg':
          return Promise.resolve({
            message_id: messageId,
            type: 'twitter',
          });
        default:
          return Promise.reject(undefined);
      }
    },
  };
});
jest.mock('./getDefaultIdentity', () => ({
  getDefaultIdentity: ({ parentMessage } = {}) => (dispatch) => {
    dispatch({ type: 'getDefaultIdentity', payload: { parentMessage } });

    if (!!parentMessage && parentMessage.type === 'twitter') {
      return Promise.resolve({
        identity_id: 'ident-twitter',
      });
    }

    return Promise.resolve({
      identity_id: 'ident-default-mail',
    });
  },
}));

describe('modules draftMessage - actions - requestDraft', () => {
  describe('new discussion', () => {
    it('creates a new draft', async () => {
      const store = getStore();
      const draft = {
        body: '',
        subject: '',
        user_identities: expect.anything(),
        message_id: expect.anything(),
      };
      const expectedActions = [
        requestDraftBase({ internalId: 'unknown' }),
        { type: 'getMessage', payload: { messageId: 'unknown' } },
        { type: 'getDefaultIdentity', payload: { } },
        createDraft({ internalId: 'unknown', draft }),
        requestDraftSuccess({
          internalId: 'unknown',
          draft,
        }),
      ];
      const action = requestDraft({ internalId: 'unknown', hasDiscussion: false });

      const result = await store.dispatch(action);
      expect(result).toEqual(draft);
      expect(result.user_identities.length).toEqual(1);
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('has default identity', async () => {
      const store = getStore();
      const action = requestDraft({ internalId: 'unknown', hasDiscussion: false });

      const result = await store.dispatch(action);
      expect(result.user_identities).toEqual(['ident-default-mail']);
    });

    it('fetch an existing draft', async () => {
      const store = getStore();
      const message = {
        message_id: 'saved',
        body: 'saved draft',
        type: 'email',
      };
      const expectedActions = [
        requestDraftBase({ internalId: 'saved' }),
        { type: 'getMessage', payload: { messageId: 'saved' } },
        requestDraftSuccess({
          internalId: 'saved',
          draft: message,
        }),
      ];
      const action = requestDraft({ internalId: 'saved', hasDiscussion: false });

      const result = await store.dispatch(action);
      expect(result).toEqual(message);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('existing discussion', () => {
    it('creates a new draft', async () => {
      const store = getStore();
      const draft = {
        discussion_id: '02',
        body: '',
        user_identities: expect.anything(),
        parent_id: 'last-msg',
        subject: 'Parent msg subject',
        message_id: expect.anything(),
      };

      const expectedActions = [
        requestDraftBase({ internalId: '02' }),
        { type: 'getDraft', payload: { discussionId: '02' } },
        { type: 'getLastMessage', payload: { discussionId: '02' } },
        { type: 'getMessage', payload: { messageId: draft.parent_id } },
        { type: 'getDefaultIdentity', payload: { } },
        createDraft({ internalId: '02', draft }),
        requestDraftSuccess({ internalId: '02', draft }),
      ];
      const action = requestDraft({ internalId: '02', hasDiscussion: true });

      const result = await store.dispatch(action);
      expect(result).toEqual(draft);
      expect(result.user_identities.length).toEqual(1);
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('new twitter draft', async () => {
      const store = getStore();
      const draft = {
        discussion_id: '03',
        body: '',
        subject: '',
        user_identities: ['ident-twitter'],
        parent_id: 'twitter-msg',
        message_id: expect.anything(),
      };

      const expectedActions = [
        requestDraftBase({ internalId: '03' }),
        { type: 'getDraft', payload: { discussionId: '03' } },
        { type: 'getLastMessage', payload: { discussionId: '03' } },
        { type: 'getMessage', payload: { messageId: draft.parent_id } },
        { type: 'getDefaultIdentity', payload: { parentMessage: { message_id: 'twitter-msg', type: 'twitter' } } },
        createDraft({ internalId: '03', draft }),
        requestDraftSuccess({ internalId: '03', draft }),
      ];
      const action = requestDraft({ internalId: '03', hasDiscussion: true });

      const result = await store.dispatch(action);
      expect(result).toEqual(draft);
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('uses store', async () => {
      const draft = {
        message_id: 'bar',
        discussion_id: 'foo',
        is_draft: true,
      };

      const store = mockStore({
        message: {
          messagesById: {},
        },
        draftMessage: {
          draftsByInternalId: {
            foo: draft,
          },
        },
      });

      const expectedActions = [];
      const action = requestDraft({ internalId: 'foo', hasDiscussion: true });

      const result = await store.dispatch(action);
      expect(result).toEqual(draft);
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('fetch discussion with a result', async () => {
      const draft = {
        message_id: 'bar',
        discussion_id: '01',
        is_draft: true,
      };
      const store = getStore();
      const expectedActions = [
        requestDraftBase({ internalId: '01' }),
        { type: 'getDraft', payload: { discussionId: '01' } },
        requestDraftSuccess({ internalId: '01', draft }),
      ];
      const action = requestDraft({ internalId: '01', hasDiscussion: true });

      const result = await store.dispatch(action);
      expect(result).toEqual(draft);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
