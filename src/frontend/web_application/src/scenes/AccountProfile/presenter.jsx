import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import './style.scss';

class AccountProfile extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestUser: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
    onRemoteIdentityChange: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
    isFetching: PropTypes.bool,
  };
  static defaultProps = {
    user: undefined,
    isFetching: false,
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
    const { user, isFetching, __ } = this.props;

    return (
      <div>
        <Spinner isLoading={isFetching} />
        {
          user && (
          <div className="s-account">
            <div className="s-account__col-datas-irl">
              {user.contact && (
                <ContactProfile
                  className="s-account__contact-profile"
                  contact={user.contact}
                  onChange={this.handleContactChange}
                />
              )}
            </div>
            <div className="s-account__col-datas-online">
              <ContactDetails
                contact={user.contact}
                onUpdateContact={this.handleContactChange}
                remoteIdentities={user.remoteIdentities}
                onConnectRemoteIdentity={this.handleConnectRemoteIdentity}
                onDisconnectRemoteIdentity={this.handleDisonnectRemoteIdentity}
                allowConnectRemoteEntity
                __={__}
              />
            </div>
          </div>
          )
        }
      </div>
    );
  }
}

export default AccountProfile;
