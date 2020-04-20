import reducer, * as module from './draft-message';

describe('ducks module draft-message', () => {
  describe('reducer', () => {
    it('reduces EDIT_DRAFT', () => {
      const draft = { message_id: '111', participants: [], body: 'bar' };
      const initialState = {
        ...reducer(undefined, { type: '@@INIT' }),
        draftsByInternalId: {
          a111: draft,
        },
      };
      const body = 'foo';
      expect(
        reducer(
          undefined,
          module.editDraft({ internalId: 'a111', draft: { ...draft, body } })
        )
      ).toEqual({
        ...initialState,
        draftsByInternalId: {
          a111: {
            ...draft,
            body,
          },
        },
      });
    });
  });
});
