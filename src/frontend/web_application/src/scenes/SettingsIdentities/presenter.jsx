import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IdentityForm from './components/IdentityForm';
import { PageTitle } from '../../components/';

import './style.scss';

function generateStateFromProps({ remoteIdentities }) {
  return {
    remoteIdentities,
  };
}

class SettingsIdentities extends Component {
  static propTypes = {
    requestRemoteIdentities: PropTypes.func.isRequired,
    onRemoteIdentityChange: PropTypes.func.isRequired,
    onRemoteIdentityDelete: PropTypes.func.isRequired,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
  };
  static defaultProps = {
    remoteIdentities: undefined,
  };

  state = {
    remoteIdentities: [],
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentDidMount() {
    this.props.requestRemoteIdentities();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
  }

  // handleCreate = () => {
  //   this.setState(prevState => ({
  //     remoteIdentities: [...prevState.remoteIdentities, {
  //       credentials: {},
  //       display_name: '',
  //       infos: {},
  //       status: 'inactive',
  //       type: 'imap',
  //     }],
  //   }));
  // }

  renderRemoteIdentity(remoteIdentity) {
    const { onRemoteIdentityChange, onRemoteIdentityDelete } = this.props;

    return (
      <div className="s-settings-identities__identity" key={remoteIdentity.remote_id}>
        <IdentityForm
          remoteIdentity={remoteIdentity}
          onRemoteIdentityChange={onRemoteIdentityChange}
          onRemoteIdentityDelete={onRemoteIdentityDelete}
        />
      </div>
    );
  }

  render() {
    const { onRemoteIdentityChange, onRemoteIdentityDelete } = this.props;

    return (
      <div className="s-settings-identities">
        <PageTitle />
        <div className="s-settings-identities__create">
          <IdentityForm
            onRemoteIdentityChange={onRemoteIdentityChange}
            onRemoteIdentityDelete={onRemoteIdentityDelete}
          />
        </div>
        {
          this.state.remoteIdentities
            .map(remoteIdentity => this.renderRemoteIdentity(remoteIdentity))
        }
      </div>
    );
  }
}

export default SettingsIdentities;
