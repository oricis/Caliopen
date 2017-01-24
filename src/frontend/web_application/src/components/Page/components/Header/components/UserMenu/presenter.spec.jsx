import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component UserMenu', () => {
  const user = {
    name: 'Bender',
    contact: {
      title: 'Mr Bender',
      emails: [
        { address: 'bender@planetexpress.tld' },
      ],
    },
  };
  const translate = str => str;

  it('render', () => {
    const comp = shallow(
      <Presenter user={user} __={translate} />
    );

    expect(comp.find('VerticalMenuTextItem').length).toEqual(1);
    expect(comp.find('VerticalMenuTextItem').first().render().text()).toContain(user.contact.title);
  });
});
