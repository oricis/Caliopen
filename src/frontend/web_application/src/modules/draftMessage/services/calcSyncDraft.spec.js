import { calcSyncDraft } from './calcSyncDraft';

describe('modules identity - service - calcSyncDraft', () => {
  it('simple newer message', () => {
    const draft = { participants: [], body: 'new body' };
    const message = {
      body: 'old body',
      message_id: '111',
      discussion_id: '112',
    };
    expect(calcSyncDraft({ draft, message })).toEqual({
      participants: [],
      body: 'new body',
      message_id: '111',
      discussion_id: '112',
    });
  });

  it('should write discussion_id or read only props', () => {
    const draft = {
      participants: [],
      body: 'new body',
      discussion_id: undefined,
    };
    const message = {
      body: 'old body',
      message_id: '111',
      discussion_id: '112',
      tags: ['foo'],
    };
    expect(calcSyncDraft({ draft, message })).toEqual({
      participants: [],
      body: 'new body',
      message_id: '111',
      discussion_id: '112',
      tags: ['foo'],
    });
  });

  it('message with new attachments', () => {
    const draft = {
      participants: [],
      body: 'new body',
      attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }],
    };
    const message = {
      body: 'old body',
      message_id: '111',
      discussion_id: '112',
      attachments: [
        { file_name: 'foo.png', temp_id: 'aabbb111' },
        { file_name: 'bar.png', temp_id: 'aabbb222' },
      ],
    };
    expect(calcSyncDraft({ draft, message })).toEqual({
      participants: [],
      body: 'new body',
      message_id: '111',
      discussion_id: '112',
      attachments: [
        { file_name: 'foo.png', temp_id: 'aabbb111' },
        { file_name: 'bar.png', temp_id: 'aabbb222' },
      ],
    });
  });

  it('message with removed attachments', () => {
    const draft = {
      participants: [],
      body: 'new body',
      attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }],
    };
    const message = {
      body: 'old body',
      message_id: '111',
      discussion_id: '112',
    };
    expect(calcSyncDraft({ draft, message })).toEqual({
      participants: [],
      body: 'new body',
      message_id: '111',
      discussion_id: '112',
    });
  });

  describe('parent_id', () => {
    it('uses draft when in discussion', () => {
      const draft = {
        parent_id: 'aabbb1',
        participants: [],
        body: 'new body',
        discussion_id: '112',
      };
      const message = {
        parent_id: 'aabbb0',
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        body: 'old body',
        message_id: '111',
        discussion_id: '112',
      };
      expect(calcSyncDraft({ draft, message })).toEqual({
        parent_id: 'aabbb1',
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        body: 'new body',
        message_id: '111',
        discussion_id: '112',
      });
    });
    it('uses message when in compose', () => {
      const draft = {
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        body: 'new body',
        discussion_id: '112',
      };
      const message = {
        parent_id: 'aabbb0',
        participants: [{ participant_id: '01' }],
        body: 'old body',
        message_id: '111',
        discussion_id: '112',
      };
      expect(calcSyncDraft({ draft, message })).toEqual({
        parent_id: 'aabbb0',
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        body: 'new body',
        message_id: '111',
        discussion_id: '112',
      });
    });
  });

  describe('participants', () => {
    it('uses the participants of up to date message when reply', () => {
      const draft = {
        participants: [],
        parent_id: 'aabbb1',
        body: 'new body',
        attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }],
        discussion_id: '112',
      };
      const message = {
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        parent_id: 'aabbb0',
        body: 'old body',
        message_id: '111',
        discussion_id: '112',
      };
      expect(calcSyncDraft({ draft, message })).toEqual({
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        parent_id: 'aabbb1',
        body: 'new body',
        message_id: '111',
        discussion_id: '112',
      });
    });
    it('uses the participants of up to date message when compose new but is actually a reply', () => {
      const draft = {
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        body: 'new body',
        attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }],
        discussion_id: '112',
      };
      const message = {
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        parent_id: 'aabbb0',
        body: 'old body',
        message_id: '111',
        discussion_id: '112',
      };
      expect(calcSyncDraft({ draft, message })).toEqual({
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        parent_id: 'aabbb0',
        body: 'new body',
        message_id: '111',
        discussion_id: '112',
      });
    });
    it('uses the participants of the draft when new', () => {
      const draft = {
        participants: [{ participant_id: '03' }],
        body: 'new body',
        attachments: [{ file_name: 'foo.png', temp_id: 'aabbb111' }],
      };
      const message = {
        participants: [{ participant_id: '01' }, { participant_id: '02' }],
        body: 'old body',
        message_id: '111',
        discussion_id: '112',
      };
      expect(calcSyncDraft({ draft, message })).toEqual({
        participants: [{ participant_id: '03' }],
        body: 'new body',
        message_id: '111',
        discussion_id: '112',
      });
    });
  });
});
