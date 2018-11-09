import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Button, Icon } from '../../../../components';
import PublicKeyForm from '../PublicKeyForm';

import './style.scss';

const KEY_QUALITY_CLASSES = ['weak', 'average', 'good'];
const KEY_QUALITY_ICONS = ['exclamation-triangle', 'expire-soon', 'info-circle'];

class PublicKeyList extends Component {
  static propTypes = {
    contactId: PropTypes.string.isRequired,
    publicKeys: PropTypes.arrayOf(PropTypes.shape({})),
    requestPublicKeys: PropTypes.func.isRequired,
    didInvalidate: PropTypes.bool,
  };

  static defaultProps = {
    didInvalidate: false,
    publicKeys: [],
  };

  state = {
    editMode: false,
  };

  componentDidMount() {
    const {
      publicKeys, contactId, requestPublicKeys,
    } = this.props;

    if (publicKeys.length === 0 || this.state.didInvalidate) {
      requestPublicKeys({ contactId });
    }
  }

  componentDidUpdate() {
    const {
      publicKeys, contactId, requestPublicKeys,
    } = this.props;

    if (publicKeys.length === 0 || this.state.didInvalidate) {
      requestPublicKeys({ contactId });
    }
  }

  static getDerivedStateFromProps(props, state) {
    return { ...state, didInvalidate: props.didInvalidate };
  }

  onSuccess = () => {
    this.setState({ editMode: false, didInvalidate: true });
  }

  getKeyQuality = (publicKey) => {
    let score = 2;

    score -= Date.parse(publicKey.expire_date) > Date.now() ? 0 : 1;
    // XXX: not sure about this
    // score -= publicKey.size >= 2048 ? 0 : 1;

    return score;
  };

  enterEditMode = () => {
    this.setState({ editMode: true });
  }

  quitEditMode = () => {
    this.setState({ editMode: false });
  }

  handleEdit = publicKey => () => this.setState({ editMode: publicKey.key_id });

  render() {
    const { publicKeys, contactId } = this.props;

    return (
      <ul>
        {publicKeys.map(publicKey => (
          this.state.editMode === publicKey.key_id ?
            <li>
              <PublicKeyForm
                key={publicKey.key_id}
                contactId={contactId}
                publicKey={publicKey}
                onSuccess={this.onSuccess}
                onCancel={this.quitEditMode}
              />
            </li>
          : (
            <li key={publicKey.key_id} className="m-public-key-list__key">
              <Icon
                type={KEY_QUALITY_ICONS[this.getKeyQuality(publicKey)]}
                className={`m-public-key-list__quality-icon--${KEY_QUALITY_CLASSES[this.getKeyQuality(publicKey)]}`}
                rightSpaced
              />
              <strong className="m-public-key-list__key-label">{publicKey.label}</strong>&nbsp;:&nbsp;{publicKey.fingerprint}
              <Button icon="edit" className="m-public-key-list__edit-button" onClick={this.handleEdit(publicKey)} />
            </li>
          )))}
        { this.state.editMode === true ?
          <PublicKeyForm
            contactId={contactId}
            onSuccess={this.onSuccess}
            onCancel={this.quitEditMode}
          />
          :
          <Button onClick={this.enterEditMode} color="active" icon="key" type="button">
            <Trans id="public-keys-list.add-key.label">Add public key</Trans>
          </Button> }
      </ul>
    );
  }
}

export default PublicKeyList;
