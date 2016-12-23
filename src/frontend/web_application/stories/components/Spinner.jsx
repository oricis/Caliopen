import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Spinner from '../../src/components/Spinner';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        isLoading: true,
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
          <Spinner {...this.state.props} />
        </ComponentWrapper>
        <ul>
          <li><label><input type="checkbox" name="isLoading" checked={this.state.props.isLoading} onChange={this.handlePropsChanges} />isLoading</label></li>
        </ul>
        <Code>
          {`
import Spinner from './src/components/Spinner';

export default () => (<Spinner isLoading />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
