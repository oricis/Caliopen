import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Button from '../../src/components/Button';
import { Code, ComponentWrapper } from '../presenters';

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        plain: false,
        expanded: false,
        hollow: false,
        active: false,
        alert: false,
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
          <Button {...this.state.props} onClick={action('clicked')}>Click Me</Button>
        </ComponentWrapper>
        <ul>
          <li><label><input type="checkbox" name="plain" checked={this.state.props.plain} onChange={this.handlePropsChanges} /> Plain</label></li>
          <li><label><input type="checkbox" name="expanded" checked={this.state.props.expanded} onChange={this.handlePropsChanges} /> Expanded</label></li>
          <li><label><input type="checkbox" name="hollow" checked={this.state.props.hollow} onChange={this.handlePropsChanges} /> Hollow</label></li>
          <li><label><input type="checkbox" name="active" checked={this.state.props.active} onChange={this.handlePropsChanges} /> Active</label></li>
          <li><label><input type="checkbox" name="alert" checked={this.state.props.alert} onChange={this.handlePropsChanges} /> Alert</label></li>
        </ul>
        <Code>
          {`
import Button from './src/components/Button';
export default () => (<Button plain expanded hollow active alert />);
          `}
        </Code>
      </div>
    );
  }
}

export default Buttons;
