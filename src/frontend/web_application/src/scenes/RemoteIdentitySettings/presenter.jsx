import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NewIdentity from './components/NewIdentity';
import RemoteIdentity from './components/RemoteIdentity';
import { PageTitle } from '../../components';

import './style.scss';

class RemoteIdentitySettings extends Component {
  static propTypes = {
    requestRemoteIdentities: PropTypes.func.isRequired,
    onIdentityChange: PropTypes.func.isRequired,
    onIdentityDelete: PropTypes.func.isRequired,
    identities: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    identities: undefined,
  };

  componentDidMount() {
    this.props.requestRemoteIdentities();
  }

  handleChange = async (...params) => {
    const { onIdentityChange } = this.props;

    return onIdentityChange(...params);
  }

  handleDelete = async (...params) => {
    const { onIdentityDelete } = this.props;

    return onIdentityDelete(...params);
  }

  handleClear = () => {
    this.props.requestRemoteIdentities();
  }

  handleCreate = async (...params) => {
    await this.handleChange(...params);
    this.handleClear();
  }

  renderIdentity(identity) {
    return (
      <div className="s-settings-identities__identity" key={identity.identity_id}>
        <RemoteIdentity
          remoteIdentity={identity}
          onRemoteIdentityChange={this.handleChange}
          onRemoteIdentityDelete={this.handleDelete}
          onClear={this.handleClear}
        />
      </div>
    );
  }

  render() {
    const { onIdentityDelete, identities } = this.props;

    return (
      <div className="s-settings-identities">
        <PageTitle />
        <div className="s-settings-identities__create">
          <NewIdentity
            onRemoteIdentityChange={this.handleCreate}
            onRemoteIdentityDelete={onIdentityDelete}
            onClear={this.handleClear}
          />
        </div>
        <Fragment>
          {
            identities
              .map(identity => this.renderIdentity(identity))
          }
        </Fragment>
      </div>
    );
  }
}

export default RemoteIdentitySettings;
