import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import CollectionFieldGroup from '../../src/components/form/CollectionFieldGroup/presenter';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
      displaySwitch: false,
    };
    this.handlePropsChanges = this.handlePropsChanges.bind(this);
  }

  handlePropsChanges(event) {
    const { name, checked } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: checked,
      },
    }));
  }
  render() {
    const handleInputChange = (event) => {
      this.setState({
        displaySwitch: event.target.value,
      });
    };

    const collection = [
      'foo',
      'bar',
      'bazzz',
    ];

    const noop = str => str;

    return (
      <div>
        <ComponentWrapper>
          <CollectionFieldGroup
            collection={collection}
            addLabel="Add an item"
            itemLabel="An item"
            onChange={action('change')}
            __={noop}
            {...this.state.props}
          />
        </ComponentWrapper>
        <Code>
          {`
import { CollectionFieldGroup } from './src/components/form';

const collection = ['foo', 'bar', 'bazzz'];
const handleChange = (updatedColl) => {
  // do the things with updated collection
};

<CollectionFieldGroup
  collection={collection}
  addLabel="Add an item"
  itemLabel="An item"
  onChange={handleChange}
/>
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
