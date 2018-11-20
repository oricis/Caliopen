import configureMockStore from 'redux-mock-store';
import promiseMiddleware from '../../../store/middlewares/promise-middleware';
import thunkMiddleware from '../../../store/middlewares/thunk-middleware';
import { requestDraft } from './requestDraft';
import { requestDraft as requestDraftBase, requestDraftSuccess, createDraft } from '../../../store/modules/draft-message';

const mockStore = configureMockStore([promiseMiddleware, thunkMiddleware]);
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
            discussion_id: '01',
            subject: 'Parent msg subject',
            is_draft: false,
          });
        default:
          return Promise.resolve(undefined);
      }
    },
  };
});
jest.mock('../../identity', () => ({
  getLocalIdentities: () => (dispatch) => {
    dispatch({ type: 'getLocalIdentities', payload: { } });

    return Promise.resolve([]);
  },
}));

describe('modules draftMessage - actions - requestDraft', () => {
  it('creates a new draft for a new discussion', async () => {
    const store = mockStore({
      message: {
        messagesById: {},
      },
      draftMessage: {
        draftsByInternalId: {
        },
      },
    });
    const draft = {
      body: '',
      subject: '',
      user_identities: [],
      message_id: expect.anything(),
    };

    const expectedActions = [
      requestDraftBase({ internalId: 'unknown' }),
      { type: 'getLocalIdentities', payload: { } },
      createDraft({ internalId: 'unknown', draft }),
      requestDraftSuccess({
        internalId: 'unknown',
        draft,
      }),
    ];
    const action = requestDraft({ internalId: 'unknown', hasDiscussion: false });

    const result = await store.dispatch(action);
    expect(result).toEqual(draft);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates a new draft for an existing discussion', async () => {
    const store = mockStore({
      message: {
        messagesById: {},
      },
      draftMessage: {
        draftsByInternalId: {
        },
      },
    });
    const draft = {
      discussion_id: '02',
      body: '',
      user_identities: [],
      parent_id: 'last-msg',
      subject: 'Parent msg subject',
      message_id: expect.anything(),
    };

    const expectedActions = [
      requestDraftBase({ internalId: '02' }),
      { type: 'getDraft', payload: { discussionId: '02' } },
      { type: 'getLastMessage', payload: { discussionId: '02' } },
      { type: 'getLocalIdentities', payload: { } },
      createDraft({ internalId: '02', draft }),
      requestDraftSuccess({ internalId: '02', draft }),
    ];
    const action = requestDraft({ internalId: '02', hasDiscussion: true });

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
    const store = mockStore({
      message: {
        messagesById: {},
      },
      draftMessage: {
        draftsByInternalId: {},
      },
    });

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
