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
      expect(reducer(undefined, module.editDraft({ internalId: 'a111', draft: { ...draft, body } }))).toEqual({
        ...initialState,
        draftsByInternalId: {
          a111: {
            ...draft,
            body,
          },
        },
      });
    });

    describe('reduces SYNC_DRAFT', () => {
      it('simple newer message', () => {
        const draft = { participants: [], body: 'new body' };
        const initialState = {
          ...reducer(undefined, { type: '@@INIT' }),
          draftsByInternalId: {
            a111: draft,
          },
        };
        const message = {
          body: 'old body',
          message_id: '111',
          discussion_id: '112',
        };
        expect(reducer(initialState, module.syncDraft({ internalId: 'a111', draft: message }))).toEqual({
          ...initialState,
          draftsByInternalId: {
            a111: {
              participants: [],
              body: 'new body',
              message_id: '111',
              discussion_id: '112',
            },
          },
        });
      });

      it('should write discussion_id or read only props', () => {
        const draft = { participants: [], body: 'new body', discussion_id: undefined };
        const initialState = {
          ...reducer(undefined, { type: '@@INIT' }),
          draftsByInternalId: {
            a111: draft,
          },
        };
        const message = {
          body: 'old body',
          message_id: '111',
          discussion_id: '112',
          tags: ['foo'],
        };
        expect(reducer(initialState, module.syncDraft({ internalId: 'a111', draft: message }))).toEqual({
          ...initialState,
          draftsByInternalId: {
            a111: {
              participants: [],
              body: 'new body',
              message_id: '111',
              discussion_id: '112',
              tags: ['foo'],
            },
          },
        });
      });

      it('message with new attachments', () => {
        const draft = { participants: [], body: 'new body', attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }] };
        const initialState = {
          ...reducer(undefined, { type: '@@INIT' }),
          draftsByInternalId: {
            a111: draft,
          },
        };
        const message = {
          body: 'old body',
          message_id: '111',
          discussion_id: '112',
          attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }, { file_name: 'bar.png', temp_id: 'aabbb222' }],
        };
        expect(reducer(initialState, module.syncDraft({ internalId: 'a111', draft: message }))).toEqual({
          ...initialState,
          draftsByInternalId: {
            a111: {
              participants: [],
              body: 'new body',
              message_id: '111',
              discussion_id: '112',
              attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }, { file_name: 'bar.png', temp_id: 'aabbb222' }],
            },
          },
        });
      });

      it('message with removed attachments', () => {
        const draft = { participants: [], body: 'new body', attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }] };
        const initialState = {
          ...reducer(undefined, { type: '@@INIT' }),
          draftsByInternalId: {
            a111: draft,
          },
        };
        const message = {
          body: 'old body',
          message_id: '111',
          discussion_id: '112',
        };
        expect(reducer(initialState, module.syncDraft({ internalId: 'a111', draft: message }))).toEqual({
          ...initialState,
          draftsByInternalId: {
            a111: {
              participants: [],
              body: 'new body',
              message_id: '111',
              discussion_id: '112',
            },
          },
        });
      });
    });
  });
});
