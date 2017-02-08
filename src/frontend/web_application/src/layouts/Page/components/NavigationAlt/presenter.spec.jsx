import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component NavigationAlt', () => {
  const user = {
    name: 'Bender',
    contact: {
      title: 'Mr Bender',
      emails: [
        { address: 'bender@planetexpress.tld' },
      ],
    },
  };
  const applications = [];
  const translate = str => str;

  it('render', () => {
    const currentApplication = {};

    const comp = shallow(
      <Presenter
        applications={applications}
        currentApplication={currentApplication}
        user={user}
        __={translate}
      />
    );

    expect(comp.find('ContactAvatarLetter').length).toEqual(1);
    expect(comp.find('.l-nav-alt__user-name').text()).toContain(user.name);
  });
});
