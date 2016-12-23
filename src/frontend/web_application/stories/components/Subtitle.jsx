import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Subtitle from '../../src/components/Subtitle';
import Button from '../../src/components/Button';
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
    this.handleHasAction = this.handleHasAction.bind(this);
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

  handleHasAction() {
    this.setState(prevState => ({
      hasAction: !prevState.hasAction,
      props: {
        ...prevState.props,
        actions: !prevState.hasAction ? (<Button className="pull-right">Foo</Button>) : undefined,
      },
    }));
  }

  render() {
    return (
      <div>
        <ComponentWrapper>
          <Subtitle {...this.state.props}>Hello world</Subtitle>
        </ComponentWrapper>
        <ul>
          <li><label><input type="checkbox" name="hr" checked={this.state.props.hr} onChange={this.handlePropsChanges} />Hr</label></li>
          <li><label><input type="checkbox" checked={this.state.hasAction} onChange={this.handleHasAction} />Actions</label></li>
        </ul>
        <Code>
          {`
import Subtitle from './src/components/Subtitle';

export default () => (<Subtitle hr actions={(<a href className="pull-right">Foo</a>)}>Hello world</Subtitle>);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
