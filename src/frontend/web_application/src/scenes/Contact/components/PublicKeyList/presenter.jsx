import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Button } from '../../../../components';

class PublicKeyList extends PureComponent {
  static propTypes = {
    contactId: PropTypes.string.isRequired,
    publicKeys: PropTypes.arrayOf(PropTypes.shape({})),
    requestPublicKeys: PropTypes.func.isRequired,
  };

  static defaultProps = {
    publicKeys: [],
  };

  componentDidMount() {
    const { publicKeys, contactId, requestPublicKeys } = this.props;

    if (publicKeys.length === 0) {
      requestPublicKeys({ contactId });
    }
  }

  render() {
    const { publicKeys } = this.props;

    return (
      <Fragment>
        {publicKeys.map(publicKey => (
          <div key={publicKey.key_id} className="m-public-key-list__key">
            {publicKey.label}
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
