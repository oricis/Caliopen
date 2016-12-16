import React, { Component, PropTypes } from 'react';
import { enums } from 'openpgp';
import classnames from 'classnames';
import { DateTime, withTranslator } from '@gandi/react-translate';
import Button from '../Button';
import Icon from '../Icon';
import DefList from '../DefList';
import { getKeyFromASCII } from '../../services/openpgp-manager';
import './style.scss';

function getViewValues(publicKey, keyStatuses) {
  return {
    fingerprint: publicKey.primaryKey.fingerprint,
    userId: publicKey.getPrimaryUser().user.userId.userid,
    createdAt: publicKey.primaryKey.created,
    expirationTime: publicKey.getExpirationTime(),
    algorithm: publicKey.primaryKey.algorithm,
    bitSize: publicKey.primaryKey.getBitSize(),
    userIds: publicKey.users.map(user => user.userId.userid),
    keyStatus: Object.keys(keyStatuses)
      .find(statusLiteral => keyStatuses[statusLiteral] === publicKey.verifyPrimaryKey()),
  };
}

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
    this.keyStatus = enums.keyStatus;
  }

  componentWillMount() {
    this.initViewValues();
  }

  initViewValues() {
    const publicKey = getKeyFromASCII(this.props.publicKeyArmored);
    this.viewValues = getViewValues(publicKey, this.keyStatus);
  }

  handleDeleteKey() {
    this.props.onDeleteKey({ fingerprint: this.viewValues.fingerprint });
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
          <div className="m-openpgp-key__fingerprint">{this.viewValues.fingerprint}</div>

          <div className="m-openpgp-key__actions">
            <Button
              className={classnames({ 'm-openpgp-key__toggle-info--warning': this.viewValues.keyStatus !== 'valid' })}
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
            <span>{this.viewValues.userId}</span>
            {this.viewValues.createdAt && (
              <DateTime format="ll">{this.viewValues.createdAt}</DateTime>
            )}
            {' '}
            {this.viewValues.expirationTime && this.viewValues.expirationTime.length && (
              <span>
                / <DateTime format="ll">{this.viewValues.expirationTime}</DateTime>
              </span>
            )}
            {' '}
            {this.viewValues.keyStatus && openpgpStatuses[this.viewValues.keyStatus]}
          </div>
        )}

        {this.state.showDetails && (
          <div className="m-openpgp-key__details">
            <DefList className="m-openpgp-key__detail">{[
              { title: __('openpgp.details.identities'), descriptions: this.viewValues.userIds },
              { title: __('openpgp.details.algorithm'), descriptions: [this.viewValues.algorithm] },
              { title: __('openpgp.details.key-size'), descriptions: [this.viewValues.bitSize] },
              { title: __('openpgp.details.status'), descriptions: [openpgpStatuses[this.viewValues.keyStatus]] },
              { title: __('openpgp.details.creation'), descriptions: this.viewValues.createdAt ? [<DateTime format="ll">{this.viewValues.createdAt}</DateTime>] : [] },
              { title: __('openpgp.details.expiration'), descriptions: this.viewValues.expirationTime ? [<DateTime format="ll">{this.viewValues.expirationTime}</DateTime>] : [] },
            ]}</DefList>

            <div className="m-openpgp-key__detail">
              <textarea-field-group
                label="'openpgp.public-key'|translate"
                model={publicKeyArmored}
              />
            </div>
            <div className="m-openpgp-key__detail">
              <textarea-field-group
                ng-if="!!$ctrl.privateKeyArmored"
                label="'openpgp.private-key'|translate"
                model={privateKeyArmored}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default OpenPGPKey;
