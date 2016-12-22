import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import TextList, { ItemContent } from '../../src/components/TextList';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper tall>
          <TextList>
            {[
              'Standard string',
              <ItemContent>Foo, Simple ItemContent</ItemContent>,
              <ItemContent>Bar, Simple ItemContent</ItemContent>,
              <ItemContent large>Foo, Large ItemContent</ItemContent>,
              <ItemContent large>Bar, Large ItemContent</ItemContent>,
            ]}
          </TextList>
        </ComponentWrapper>
        <Code>
          {`
import TextList from './src/components/TextList';

export default () => (
  <TextList>
    {[
      'Standard string',
      <ItemContent>Foo, Simple ItemContent</ItemContent>,
      <ItemContent>Bar, Simple ItemContent</ItemContent>,
      <ItemContent large>Foo, Large ItemContent</ItemContent>,
      <ItemContent large>Bar, Large ItemContent</ItemContent>,
    ]}
  </TextList>
);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
