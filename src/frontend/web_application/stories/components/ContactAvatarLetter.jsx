import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import ContactAvatarLetter, { SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE } from '../../src/components/ContactAvatarLetter';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        size: SIZE_SMALL,
      },
    };
    this.handlePropsChanges = this.handlePropsChanges.bind(this);
    this.renderSelectSize = this.renderSelectSize.bind(this);
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

  renderSelectSize() {
    return (
      <select name="size" value={this.state.props.size} onChange={this.handlePropsChanges}>
        {[SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE].map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
    );
  }

  render() {
    const contact = { title: 'Foobar' };

    return (
      <div>
        <ComponentWrapper size="tall">
          <ContactAvatarLetter {...this.state.props} contact={contact} />
        </ComponentWrapper>
        <ul>
          <li><label>Size: {this.renderSelectSize()}</label></li>
        </ul>
        <Code>
          {`
import ContactAvatarLetter, { SIZE_SMALL } from './src/components/ContactAvatarLetter';
export default () => (<ContactAvatarLetter size={SIZE_SMALL} contact={contact} />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
