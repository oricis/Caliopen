import React, { Component, PropTypes } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import CollectionFieldGroup from '../../src/components/form/CollectionFieldGroup/presenter';
import { TextFieldGroup } from '../../src/components/form';
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
    const collection = [
      'foo',
      'bar',
      'bazzz',
    ];

    const noop = str => str;

    const addTemplate = ({ item, onChange, ...props }) => {
      const handleChange = ev => onChange({ item: ev.target.value });

      return (
        <TextFieldGroup label="Add an item" showLabelforSr value={item} onChange={handleChange} {...props} />
      );
    };

    const editTemplate = ({ item, onChange, ...props }) => {
      const handleChange = ev => onChange({ item: ev.target.value });

      return (
        <TextFieldGroup label="An item" showLabelforSr value={item} onChange={handleChange} {...props} />
      );
    };

    return (
      <div>
        <ComponentWrapper inline >
          <CollectionFieldGroup
            collection={collection}
            onChange={action('changed')}
            addTemplate={addTemplate}
            editTemplate={editTemplate}
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

const addTemplate = ({ item, onChange, ...props }) => {
  const handleChange = ev => onChange({ item: ev.target.value });

  return (
    <TextFieldGroup label="Add an item" showLabelforSr value={item} onChange={handleChange} {...props} />
  );
};

const editTemplate = ({ item, onChange, ...props }) => {
  const handleChange = ev => onChange({ item: ev.target.value });

  return (
    <TextFieldGroup label="An item" showLabelforSr value={item} onChange={handleChange} {...props} />
  );
};

<CollectionFieldGroup
  collection={collection}
  onChange={action('changed')}
  addTemplate={addTemplate}
  editTemplate={editTemplate}
/>
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
