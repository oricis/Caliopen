import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Button, Icon } from '../../../../components';

// const KEY_QUALITY_CLASSES = ['weak', 'average', 'good'];
const KEY_QUALITY_ICONS = ['exclamation-triangle', 'expire-soon', 'info-circle'];

class PublicKeyList extends PureComponent {
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

  componentDidMount() {
    const {
      publicKeys, contactId, didInvalidate, requestPublicKeys,
    } = this.props;

    if (publicKeys.length === 0 || didInvalidate) {
      requestPublicKeys({ contactId });
    }
  }

  getKeyQuality = (publicKey) => {
    let score = 2;

    score -= publicKey.expire_date > Date.now ? 0 : 1;
    score -= publicKey.size >= 2048 ? 0 : 1;

    return score;
  };

  handleDelete = publicKey => () => {
    const { contactId, deletePublicKey } = this.props;

    deletePublicKey({ contactId, publicKeyId: publicKey.key_id });
  }

  render() {
    const { publicKeys } = this.props;

    return (
      <Fragment>
        {publicKeys.map(publicKey => (
          <div key={publicKey.key_id} className="m-public-key-list__key">
            <Icon type={KEY_QUALITY_ICONS[this.getKeyQuality(publicKey)]} rightSpaced />
            <strong className="m-public-key-list__key-label">{publicKey.label}</strong>&nbsp;:&nbsp;{publicKey.fingerprint}
            <Button type="button" onClick={this.handleDelete(publicKey)}>
              <Icon type="cross" spaced />Blah
            </Button>
          </div>
        ))}
        <Button type="button">
          <Trans id="public-keys-list.add-key.label">Add public key</Trans>
        </Button>
      </Fragment>
    );
  }
}

export default PublicKeyList;
