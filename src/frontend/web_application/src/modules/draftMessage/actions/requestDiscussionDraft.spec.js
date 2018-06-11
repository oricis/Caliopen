import configureMockStore from 'redux-mock-store';
import promiseMiddleware from '../../../store/middlewares/promise-middleware';
import thunkMiddleware from '../../../store/middlewares/thunk-middleware';
import { requestDiscussionDraft } from './requestDiscussionDraft';
import { createDraft } from '../../../store/modules/draft-message';

const mockStore = configureMockStore([promiseMiddleware, thunkMiddleware]);
jest.mock('../../../store/modules/message', () => ({
  requestMessages: (type, key) => (dispatch) => {
    dispatch({ type: 'requestMessages', payload: { type, key } });

    switch (key) {
      case 'foo':
        return Promise.resolve({
          payload: {
            data: {
              messages: [{
                message_id: 'bar',
                discussion_id: 'foo',
                is_draft: true,
              }],
            },
            status: 200,
          },
        });
      case 'bar':
        return Promise.resolve({
          payload: {
            data: {
              messages: [{
                message_id: 'bar',
                discussion_id: 'bar',
                is_draft: false,
              }],
            },
            status: 200,
          },
        });
      default:
        return Promise.resolve({
          payload: {
            data: {
              messages: [],
            },
          },
        });
    }
  },
}));
jest.mock('../../identity', () => ({
  getLocalIdentities: () => (dispatch) => {
    dispatch({ type: 'getLocalIdentities', payload: { } });

    return Promise.resolve([]);
  },
}));

describe('modules draftMessage - actions - requestDiscussionDraft', () => {
  it('creates a new draft', async () => {
    const store = mockStore({
      draftMessage: {
        draftsByInternalId: {
        },
      },
    });
    const draft = {
      discussion_id: 'unknown',
      body: '',
      identities: [],
      parent_id: '',
      subject: '',
      message_id: expect.anything(),
    };

    const expectedActions = [
      { type: 'requestMessages', payload: { type: 'discussion', key: 'unknown' } },
      { type: 'getLocalIdentities', payload: { } },
      createDraft({ internalId: 'unknown', draft }),
    ];
    const action = requestDiscussionDraft({ internalId: 'unknown', discussionId: 'unknown' });

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
      draftMessage: {
        draftsByInternalId: {
          foo: draft,
        },
      },
    });

    const expectedActions = [];
    const action = requestDiscussionDraft({ internalId: 'foo', discussionId: 'whatever' });

    const result = await store.dispatch(action);
    expect(result).toEqual(draft);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('fetch discussion with a result', async () => {
    const draft = {
      message_id: 'bar',
      discussion_id: 'foo',
      is_draft: true,
    };
    const store = mockStore({
      draftMessage: {
        draftsByInternalId: {},
      },
    });

    const expectedActions = [
      { type: 'requestMessages', payload: { type: 'discussion', key: 'foo' } },
    ];
    const action = requestDiscussionDraft({ internalId: 'foo', discussionId: 'foo' });

    const result = await store.dispatch(action);
    expect(result).toEqual(draft);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
