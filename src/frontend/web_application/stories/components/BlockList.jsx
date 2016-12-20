import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import BlockList, { ItemContent } from '../../src/components/BlockList';
import Link from '../../src/components/Link';
import { Code, ComponentWrapper } from '../presenters';

class BlockLists extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper tall>
          <BlockList>
            {[
              <ItemContent>Foo</ItemContent>,
              <ItemContent>Bar</ItemContent>,
              <ItemContent isLink><Link raw>A link</Link></ItemContent>,
              <ItemContent isLink><Link raw>An other link</Link></ItemContent>,
              'Bar',
            ]}
          </BlockList>
        </ComponentWrapper>
        <Code>{`
import BlockList, { ItemContent } from './src/components/BlockList';

export default () => (
  <BlockList>
    {[
      <ItemContent>Foo</ItemContent>,
      <ItemContent>Bar</ItemContent>,
      <ItemContent isLink><Link raw>A link</Link></ItemContent>,
      <ItemContent isLink><Link raw>An other link</Link></ItemContent>,
      'Bar',
    ]}
  </BlockList>
);
          `}</Code>
      </div>
    );
  }
}

export default BlockLists;
