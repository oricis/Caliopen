import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IdentityForm from './components/IdentityForm';
import { Section, Link, PageTitle, NavList, NavItem } from '../../components/';

import './style.scss';

class SettingsIdentities extends Component {
  static propTypes = {
    requestUser: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
    onRemoteIdentityChange: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
  };
  static defaultProps = {
    user: undefined,
  };

  componentDidMount() {
    this.props.requestUser();
  }

  handleContactChange = ({ contact, original }) => {
    this.props.updateContact({ contact, original }).then(() => this.props.requestUser());
  }

  handleConnectRemoteIdentity = () => {
    this.props.onRemoteIdentityChange();
  }

  handleDisonnectRemoteIdentity = () => {
    this.props.onRemoteIdentityChange();
  }

  render() {
    const { user } = this.props;

    const navLinks = [
      { title: 'myself@caliopen.local', to: '/settings/identities' },
      { title: 'myothermyself@caliopen.local', to: '/settings/identities' },
    ];

    return (
      <div className="s-settings-identities">
        <PageTitle />
        {navLinks &&
          <NavList dir="vertical" className="s-settings-identities__menu">
            {navLinks.map(link => (
              // this should be identities.map(identity => ... )
              <NavItem active={false} large key={link.title}>
                <Link noDecoration {...link}>{link.title}</Link>
              </NavItem>
            ))}
          </NavList>
        }
        <div className="s-settings-identities__panel">
          <Section title="Update your identity">
            { user && (
              <IdentityForm
                contact={user.contact}
                onUpdateContact={this.handleContactChange}
                remoteIdentities={user.remoteIdentities}
                onConnectRemoteIdentity={this.handleConnectRemoteIdentity}
                onDisconnectRemoteIdentity={this.handleDisonnectRemoteIdentity}
                allowConnectRemoteEntity
              />
            )}
          </Section>
          <Section title="Identity options">
            <p>Signature : (select signature from settings.signatures)</p>
            <p>Download directory: (browse directories)</p>
            <p>refresh: (select list)</p>
          </Section>
        </div>
      </div>
    );
  }
}

export default SettingsIdentities;
