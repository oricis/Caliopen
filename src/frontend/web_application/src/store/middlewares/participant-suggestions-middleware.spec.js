import { handleSearchAction } from './participant-suggestions-middleware';
import { search, searchSuccess, SUGGEST, SEARCH_SUCCESS } from '../modules/participant-suggestions';
import reducer from '../reducer';

describe('participant-suggestions-middleware', () => {
  it('handle search action', async () => {
    const store = {
      dispatch: jest.fn(action => new Promise((resolve) => {
        if (action.type === SUGGEST) {
          resolve({
            payload: {
              data: [
                { address: 'foo' },
                { address: 'fool' },
                { address: 'afoob' },
              ],
            },
          });
        }

        if (action.type === SEARCH_SUCCESS) {
          resolve('success');
        }

        throw new Error(`Unkown action ${action.type}`);
      })),
      getState: () => reducer(undefined, { type: '@@INIT' }),
    };
    const action = search('foo');

    await handleSearchAction({ store, action });

    expect(store.dispatch).toHaveBeenCalledWith(searchSuccess('foo', 'msg_compose', [
      { address: 'foo' },
      { address: 'fool' },
      { address: 'afoob' },
    ]));
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});
