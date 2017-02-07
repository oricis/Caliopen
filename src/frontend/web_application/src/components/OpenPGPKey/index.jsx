import React, { Component, PropTypes } from 'react';
import { enums } from 'openpgp';
import classnames from 'classnames';
import { DateTime, withTranslator } from '@gandi/react-translate';
import Button from '../Button';
import Icon from '../Icon';
import DefList from '../DefList';
import { TextareaFieldGroup } from '../form';
import { getKeyFromASCII } from '../../services/openpgp-manager';
import './style.scss';

const { keyStatus: keyStatuses } = enums;

function generateStateFromProps(props) {
  const publicKey = getKeyFromASCII(props.publicKeyArmored);
  const { primaryKey: { fingerprint, created, algorithm } } = publicKey;

  return {
    openpgpKey: {
      fingerprint,
      created,
      algorithm,
      userId: publicKey.getPrimaryUser().user.userId.userid,
      expirationTime: publicKey.getExpirationTime(),
      bitSize: publicKey.primaryKey.getBitSize(),
      userIds: publicKey.users.map(user => user.userId.userid),
      keyStatus: Object.keys(keyStatuses)
        .find(statusLiteral => keyStatuses[statusLiteral] === publicKey.verifyPrimaryKey()),
    },
  };
}


// XXX: @themouette recommand to give a __ props on not routed component instead of this decorator
@withTranslator()
class OpenPGPKey extends Component {
  static propTypes = {
    __: PropTypes.func,
    children: PropTypes.node,
    publicKeyArmored: PropTypes.string.isRequired,
    privateKeyArmored: PropTypes.string,
    editMode: PropTypes.bool,
    onDeleteKey: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
    };

    this.toggleDetails = this.toggleDetails.bind(this);
    this.handleDeleteKey = this.handleDeleteKey.bind(this);
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  handleDeleteKey() {
    this.props.onDeleteKey({ fingerprint: this.state.openpgpKey.fingerprint });
  }

  toggleDetails() {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  }

  render() {
    const { __, children, publicKeyArmored, privateKeyArmored, editMode } = this.props;
    const openpgpStatuses = {
      invalid: __('openpgp.status.invalid'),
      expired: __('openpgp.status.expired'),
      revoked: __('openpgp.status.revoked'),
      valid: __('openpgp.status.valid'),
      no_self_cert: __('openpgp.status.no_self_cert'),
    };

    return (
      <div className="m-openpgp-key">
        <div className="m-openpgp-key__main">
          <div className="m-openpgp-key__icon">{children}</div>
          <div className="m-openpgp-key__fingerprint">{this.state.openpgpKey.fingerprint}</div>

          <div className="m-openpgp-key__actions">
            <Button
              className={classnames({ 'm-openpgp-key__toggle-info--warning': this.state.openpgpKey.keyStatus !== 'valid' })}
              onClick={this.toggleDetails}
            >
              <Icon type="info-circle" />
              {' '}
              <Icon type="caret-down" />
              {' '}
              <span className="show-for-sr">{__('openpgp.action.toggle-details')}</span>
            </Button>
            {editMode && (
              <Button alert onClick={this.handleDeleteKey}>
                <Icon type="remove" />
                <span className="show-for-sr">{__('openpgp.action.remove-key')}</span>
              </Button>
            )}
          </div>
        </div>

        {!this.state.showDetails && (
          <div className="m-openpgp-key__summary">
            <span>{this.state.openpgpKey.userId}</span>
            {this.state.openpgpKey.created && (
              <DateTime format="ll">{this.state.openpgpKey.created}</DateTime>
            )}
            {' '}
            {this.state.openpgpKey.expirationTime
                && this.state.openpgpKey.expirationTime.length
                && (
                  <span>
                    / <DateTime format="ll">{this.state.openpgpKey.expirationTime}</DateTime>
                  </span>
                )
            }
            {' '}
            {this.state.openpgpKey.keyStatus && openpgpStatuses[this.state.openpgpKey.keyStatus]}
          </div>
        )}

        {this.state.showDetails && (
          <div className="m-openpgp-key__details">
            <DefList
              className="m-openpgp-key__detail"
              definitions={[
                { title: __('openpgp.details.identities'), descriptions: this.state.openpgpKey.userIds },
                { title: __('openpgp.details.algorithm'), descriptions: [this.state.openpgpKey.algorithm] },
                { title: __('openpgp.details.key-size'), descriptions: [this.state.openpgpKey.bitSize] },
                { title: __('openpgp.details.status'), descriptions: [openpgpStatuses[this.state.openpgpKey.keyStatus]] },
                { title: __('openpgp.details.creation'), descriptions: this.state.openpgpKey.created ? [<DateTime format="ll">{this.state.openpgpKey.created}</DateTime>] : [] },
                { title: __('openpgp.details.expiration'), descriptions: this.state.openpgpKey.expirationTime ? [<DateTime format="ll">{this.state.openpgpKey.expirationTime}</DateTime>] : [] },
              ]}
            />

            <TextareaFieldGroup
              className="m-openpgp-key__detail"
              label={__('openpgp.public-key')}
              readOnly
              value={publicKeyArmored}
            />
            {privateKeyArmored && (
              <TextareaFieldGroup
                className="m-openpgp-key__detail"
                label={__('openpgp.private-key')}
                readOnly
                value={privateKeyArmored}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default OpenPGPKey;
