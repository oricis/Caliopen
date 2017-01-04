import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import ContactDetails from '../../src/components/ContactDetails';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        allowConnectRemoteEntity: false,
      },
    };
    this.handlePropsChangesBool = this.handlePropsChangesBool.bind(this);
  }

  handlePropsChangesBool(event) {
    const { name, checked } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: checked,
      },
    }));
  }

  render() {
    const contact = {
      title: 'Foobar',
      emails: [
        { address: 'abc@bar.tld', type: 'work', email_id: 'foo1' },
        { address: 'def@isprimary.tld', is_primary: true, type: 'home' },
        { address: 'abc@notbar.tld' },
      ],
      phones: [
        { number: '+33678912345' },
      ],
      ims: [
        { address: 'abc@bar.tld', type: 'work' },
      ],
      addresses: [
        { street: '42 is the answer', postal_code: '12345', city: 'Everywhere', country: 'on The Internet', label: 'An address', type: 'work' },
      ],
    };
    const remoteIdentities = [
      { identity_type: 'email', identity_id: 'foo1', is_fetching: true, connected: true },
    ];

    const translate = str => str;

    return (
      <div>
        <ComponentWrapper>
          <ContactDetails
            contact={contact}
            remoteIdentities={remoteIdentities}
            onConnectRemoteIdentity={action('connect remote identity')}
            onDisconnectRemoteIdentity={action('disconnect remote identity')}
            onAddContactDetail={action('add contact detail')}
            onDeleteContactDetail={action('delete contact detail')}
            __={translate}
            {...this.state.props}
          />
        </ComponentWrapper>
        <ul>
          <li><label><input type="checkbox" onChange={this.handlePropsChangesBool} name="allowConnectRemoteEntity" checked={this.state.props.allowConnectRemoteEntity} />Allow connect remote identity</label></li>
        </ul>
        <Code>
          {`
import ContactDetails, { SIZE_SMALL } from './src/components/ContactDetails';

export default () => (
  <ContactDetails
    contact={contact}
    remoteIdentities={remoteIdentities}
    onConnectRemoteIdentity={action('connect remote identity')}
    onDisconnectRemoteIdentity={action('disconnect remote identity')}
    onAddContactDetail={action('add contact detail')}
    onDeleteContactDetail={action('delete contact detail')}
    allowConnectRemoteEntity
    __={translate}
  />
);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
