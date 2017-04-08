import reducer, * as module from './draft-message';

describe('ducks module draft-message', () => {
  describe('reducer', () => {
    describe('reduces CREATE_DRAFT_SUCCESS', () => {
      it('updates message_id', () => {
        const initialState = reducer(undefined, { type: '@@INIT' });
        const body = 'old content';
        const draft = { message_id: '111', discussion_id: 'a111', participants: [] };
        expect(reducer(undefined, module.draftCreated({ draft: { ...draft, body } }))).toEqual({
          ...initialState,
          draftsByDiscussionId: {
            a111: draft,
          },
        });
      });

      it('doesn\'t change body with old value', () => {
        const initialDraft = { discussion_id: 'a111', participants: [], body: 'new content' };
        const initialState = {
          ...reducer(undefined, { type: '@@INIT' }),
          draftsByDiscussionId: {
            a111: initialDraft,
          },
        };
        const message = { ...initialDraft, body: 'old content', message_id: '111' };
        expect(reducer(initialState, module.draftCreated({ draft: message }))).toEqual({
          ...initialState,
          draftsByDiscussionId: {
            a111: { ...message, body: initialDraft.body },
          },
        });
      });
    });

    it('reduces EDIT_DRAFT', () => {
      const draft = { message_id: '111', participants: [], body: 'bar' };
      const initialState = {
        ...reducer(undefined, { type: '@@INIT' }),
        draftsByDiscussionId: {
          a111: draft,
        },
      };
      const body = 'foo';
      expect(reducer(undefined, module.editDraft({ discussionId: 'a111', draft: { ...draft, body } }))).toEqual({
        ...initialState,
        draftsByDiscussionId: {
          a111: {
            ...draft,
            body,
          },
        },
      });
    });
    it('reduces REQUEST_DRAFT_SUCCESS', () => {

    });
  });
});
