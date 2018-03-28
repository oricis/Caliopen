import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component DiscussionDraft', () => {
  it('render', () => {
    const props = {
      i18n: { _: id => id },
      onSave: jest.fn(),
      onSend: jest.fn(),
      renderDraftMessageActionsContainer: jest.fn(),
      renderAttachments: jest.fn(),
      draft: {
        discussion_id: undefined,
        type: 'email',
        body: '',
        participants: [],
        identities: [],
      },
    };
    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('TopRow').length).toEqual(1);
    expect(comp.find('BodyRow').length).toEqual(1);
  });
});
