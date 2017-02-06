import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import DefList from '../../src/components/DefList';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        level: 50,
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: value,
      },
    }));
  }

  render() {
    return (
      <div>
        <ComponentWrapper>
          <DefList>{[
            { title: 'Bar', descriptions: ['Bar description one', 'Bar description 2'] },
            { title: 'Foo', descriptions: ['Foo description'] },
          ]}
          </DefList>
        </ComponentWrapper>
        <Code>
          {`
import DefList from './src/components/DefList';

export default () => (
  <DefList>{[
    { title: 'Foo', descriptions: ['Foo description'] },
    { title: 'Foo', descriptions: ['Foo description'] },
  ]}</DefList>);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
