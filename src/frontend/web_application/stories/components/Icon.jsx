import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Icon, { typeAssoc } from '../../src/components/Icon';
import { Code, ComponentWrapper } from '../presenters';


class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        type: 'edit',
      },
    };
    this.handlePropsChanges = this.handlePropsChanges.bind(this);
  }

  handlePropsChanges(event) {
    const { name, value } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: value,
      },
    }));
  }

  render() {
    const types = Object.keys(typeAssoc);

    return (
      <div>
        <ComponentWrapper>
          <Icon {...this.state.props} />
        </ComponentWrapper>
        <ul>
          <li>
            <label>
              Type:
              <select name="type" onChange={this.handlePropsChanges}>{types.map(key => (<option key={key} value={key}>{key}</option>))}</select>
            </label>
          </li>
        </ul>
        <Code>
          {`
import Icon from './src/components/Icon';

export default () => (<Icon type="edit"/>);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
