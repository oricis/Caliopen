import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Button, Icon } from '../../../../components';
import PublicKeyForm from '../PublicKeyForm';

import './style.scss';

// const KEY_QUALITY_CLASSES = ['weak', 'average', 'good'];
const KEY_QUALITY_ICONS = ['exclamation-triangle', 'expire-soon', 'info-circle'];

class PublicKeyList extends Component {
  static propTypes = {
    contactId: PropTypes.string.isRequired,
    publicKeys: PropTypes.arrayOf(PropTypes.shape({})),
    requestPublicKeys: PropTypes.func.isRequired,
    deletePublicKey: PropTypes.func.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    publicKeys: [],
  };

  state = {
    editMode: false,
  };

  componentDidMount() {
    const {
      publicKeys, contactId, didInvalidate, requestPublicKeys,
    } = this.props;

    if (publicKeys.length === 0 || didInvalidate) {
      requestPublicKeys({ contactId });
    }
  }

  onDelete = () => {
    this.setState({ editMode: false });
  }

  getKeyQuality = (publicKey) => {
    let score = 2;

    score -= Date.parse(publicKey.expire_date) > Date.now() ? 0 : 1;
    score -= publicKey.size >= 2048 ? 0 : 1;

    return score;
  };

  setEditMode = () => {
    this.setState({ editMode: true });
  }

  handleEdit = publicKey => () => this.setState({ editMode: publicKey.key_id });

  render() {
    const { publicKeys, contactId } = this.props;

    return (
      <Fragment>
        {publicKeys.map(publicKey => (
          this.state.editMode === publicKey.key_id ?
            <PublicKeyForm
              contactId={contactId}
              publicKey={publicKey}
              onDelete={this.onDelete}
            />
          : (
            <div key={publicKey.key_id} className="m-public-key-list__key">
              <Icon type={KEY_QUALITY_ICONS[this.getKeyQuality(publicKey)]} rightSpaced />
              <strong className="m-public-key-list__key-label">{publicKey.label}</strong>&nbsp;:&nbsp;{publicKey.fingerprint}
              <Button icon="edit" onClick={this.handleEdit(publicKey)} />
            </div>
          )))}
        { this.state.editMode === true ? <PublicKeyForm contactId={contactId} /> :
        <Button onClick={this.setEditMode} type="button">
          <Trans id="public-keys-list.add-key.label">Add public key</Trans>
        </Button> }
      </Fragment>
    );
  }
}

export default PublicKeyList;
