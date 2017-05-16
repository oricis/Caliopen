import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslator } from '@gandi/react-translate';
import Moment from 'react-moment';
import Button from '../Button';
import Spinner from '../Spinner';
import Icon from '../Icon';
import DefList from '../DefList';
import { TextareaFieldGroup } from '../form';
import getPGPManager from '../../services/openpgp-manager';
import './style.scss';

function generateStateFromProps({ props, getKeyFromASCII, keyStatuses }) {
  const publicKey = getKeyFromASCII(props.publicKeyArmored);
  const { primaryKey: { fingerprint, created, algorithm } } = publicKey;

  return {
    isLoading: false,
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
    __: PropTypes.func.isRequired,
    locale: PropTypes.string,
    children: PropTypes.node,
    publicKeyArmored: PropTypes.string.isRequired,
    privateKeyArmored: PropTypes.string,
    editMode: PropTypes.bool,
    onDeleteKey: PropTypes.func,
  };

  static defaultProps = {
    locale: undefined,
    children: undefined,
    privateKeyArmored: undefined,
    editMode: false,
    onDeleteKey: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      isLoading: true,
      openpgpKey: {
      },
    };

    this.toggleDetails = this.toggleDetails.bind(this);
    this.handleDeleteKey = this.handleDeleteKey.bind(this);
  }

  componentDidMount() {
    getPGPManager().then(({ getKeyFromASCII, module: { enums: { keyStatus: keyStatuses } } }) =>
      this.setState(generateStateFromProps({ props: this.props, getKeyFromASCII, keyStatuses })));
  }

  componentWillReceiveProps(newProps) {
    getPGPManager().then(({ getKeyFromASCII, module: { enums: { keyStatus: keyStatuses } } }) =>
      this.setState(generateStateFromProps({ props: newProps, getKeyFromASCII, keyStatuses })));
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
    const { __, locale, children, publicKeyArmored, privateKeyArmored, editMode } = this.props;
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
          <Spinner isLoading={this.state.isLoading} />
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
              <Button color="alert" onClick={this.handleDeleteKey}>
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
              <Moment format="ll" locale={locale}>{this.state.openpgpKey.created}</Moment>
            )}
            {' '}
            {this.state.openpgpKey.expirationTime
                && this.state.openpgpKey.expirationTime.length
                && (
                  <span>
                    / <Moment format="ll" locale={locale}>{this.state.openpgpKey.expirationTime}</Moment>
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
                { title: __('openpgp.details.creation'), descriptions: this.state.openpgpKey.created ? [<Moment format="ll" locale={locale}>{this.state.openpgpKey.created}</Moment>] : [] },
                { title: __('openpgp.details.expiration'), descriptions: this.state.openpgpKey.expirationTime ? [<Moment format="ll" locale={locale}>{this.state.openpgpKey.expirationTime}</Moment>] : [] },
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
