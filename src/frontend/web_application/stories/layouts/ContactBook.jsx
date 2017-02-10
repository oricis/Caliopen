import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import ContactBook from '../../src/scenes/ContactBook';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        hr: false,
      },
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
    return (
      <div>
        <ComponentWrapper>
          <ContactBook />
        </ComponentWrapper>


        <Code>
          {`  `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
