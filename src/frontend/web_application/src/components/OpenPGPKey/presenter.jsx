import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans, withI18n } from 'lingui-react';
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

@withI18n()
class OpenPGPKey extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
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
    const { i18n, locale, children, publicKeyArmored, privateKeyArmored, editMode } = this.props;
    const openpgpStatuses = {
      invalid: i18n.t`openpgp.status.invalid`,
      expired: i18n.t`openpgp.status.expired`,
      revoked: i18n.t`openpgp.status.revoked`,
      valid: i18n.t`openpgp.status.valid`,
      no_self_cert: i18n.t`openpgp.status.no_self_cert`,
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
              <span className="show-for-sr"><Trans id="openpgp.action.toggle-details">openpgp.action.toggle-details</Trans></span>
            </Button>
            {editMode && (
              <Button color="alert" onClick={this.handleDeleteKey}>
                <Icon type="remove" />
                <span className="show-for-sr"><Trans id="openpgp.action.remove-key">openpgp.action.remove-key</Trans></span>
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
                { title: i18n.t`openpgp.details.identities`, descriptions: this.state.openpgpKey.userIds },
                { title: i18n.t`openpgp.details.algorithm`, descriptions: [this.state.openpgpKey.algorithm] },
                { title: i18n.t`openpgp.details.key-size`, descriptions: [this.state.openpgpKey.bitSize] },
                { title: i18n.t`openpgp.details.status`, descriptions: [openpgpStatuses[this.state.openpgpKey.keyStatus]] },
                { title: i18n.t`openpgp.details.creation`, descriptions: this.state.openpgpKey.created ? [<Moment format="ll" locale={locale}>{this.state.openpgpKey.created}</Moment>] : [] },
                { title: i18n.t`openpgp.details.expiration`, descriptions: this.state.openpgpKey.expirationTime ? [<Moment format="ll" locale={locale}>{this.state.openpgpKey.expirationTime}</Moment>] : [] },
              ]}
            />

            <TextareaFieldGroup
              className="m-openpgp-key__detail"
              label={i18n.t`openpgp.public-key`}
              readOnly
              value={publicKeyArmored}
            />
            {privateKeyArmored && (
              <TextareaFieldGroup
                className="m-openpgp-key__detail"
                label={i18n.t`openpgp.private-key`}
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
