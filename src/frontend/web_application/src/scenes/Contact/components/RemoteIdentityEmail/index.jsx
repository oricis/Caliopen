import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import { Button, Spinner, TextFieldGroup, SelectFieldGroup, RadioFieldGroup } from '../../../../components';

const MAX_PHASE = 3;
const MAIL_PROTOCOLS = ['', 'IMAP', 'POP'];
const FETCH_METHODS = ['from_now', 'fetch_all'];

function generateStateFromProps(props, prevState) {
  return {
    remoteIdentity: {
      ...prevState.remoteIdentity,
      ...props.remoteIdentity,
    },
  };
}

@withI18n()
class RemoteIdentityEmail extends Component {
  static propTypes = {
    remoteIdentity: PropTypes.shape({}).isRequired,
    onConnect: PropTypes.func.isRequired,
    onDisconnect: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      phase: 1,
      formErrors: {},
      remoteIdentity: {
        connected: false,
        cancel_fetch_required: false,
        params: {
          login: '',
          password: '',
          mailProtocol: '',
          incommingMailServer: '',
          mailPort: '',
          fetchMethod: '',
        },
      },
    };
    this.handleParamsChange = this.handleParamsChange.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleClickPrevious = this.handleClickPrevious.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.handleClickFinish = this.handleClickFinish.bind(this);
    this.renderFormPhase1 = this.renderFormPhase1.bind(this);
    this.renderFormPhase2 = this.renderFormPhase2.bind(this);
    this.renderFormPhase3 = this.renderFormPhase3.bind(this);
    this.initTranslations();
  }

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  initTranslations() {
    const { i18n } = this.props;
    this.translations = {
      from_now: i18n._('remote_identity.fetch_method.from_now', { defaults: 'Only all messages from now' }),
      fetch_all: i18n._('remote_identity.fetch_method.fetch_all', { defaults: 'All messages from now and the historical' }),
    };
  }

  handleClickPrevious() {
    this.setState(prevState => ({
      phase: prevState.phase - 1,
    }));
  }

  handleClickNext() {
    if (this.validate({ phase: this.state.phase })) {
      this.setState(prevState => ({
        phase: prevState.phase + 1,
      }));
    }
  }

  handleDisconnect() {
    this.props.onDisconnect({ remoteIdentity: this.state.remoteIdentity });
  }

  handleClickFinish() {
    if (!this.validate({ phase: MAX_PHASE })) {
      return;
    }

    this.setState({
      phase: 1,
    });

    this.props.onConnect({
      remoteIdentity: this.state.remoteIdentity,
    });
  }

  handleParamsChange(event) {
    const { name, value } = event.target;

    this.setState(prevState => ({
      remoteIdentity: {
        ...prevState.remoteIdentity,
        params: {
          ...prevState.remoteIdentity.params,
          [name]: value,
        },
      },
    }));
  }

  validate({ phase }) {
    let isValid = true;

    const phaseValidation = (properties) => {
      properties.forEach(({ formProperty, error }) => {
        const value = !!this.state.remoteIdentity
          && this.state.remoteIdentity.params
          && this.state.remoteIdentity.params[formProperty];

        if (!value || value.length === 0) {
          this.setState(prevState => ({
            formErrors: {
              ...prevState.formErrors,
              [formProperty]: [error],
            },
          }));
          isValid = false;
        } else {
          this.setState(prevState => ({
            formErrors: {
              ...prevState.formErrors,
              [formProperty]: [],
            },
          }));
        }
      });
    };

    if (phase >= 1) {
      phaseValidation([
        { formProperty: 'login', error: 'login is required' },
        { formProperty: 'password', error: 'password is required' },
      ]);
    }
    if (phase >= 2) {
      phaseValidation([
        { formProperty: 'mailProtocol', error: 'protocol is required' },
        { formProperty: 'incommingMailServer', error: 'mail server is required' },
        { formProperty: 'mailPort', error: 'port is required' },
      ]);
    }
    if (phase >= 3) {
      phaseValidation([
        { formProperty: 'fetchMethod', error: 'Fetch method must be defined' },
      ]);
    }

    return isValid;
  }

  renderFetchingPanel() {
    return (
      <div className="m-remote-identity__fetching-panel">
        <div className="m-remote-identity__fetching-panel-text">
          <Spinner isLoading />
          <Trans id="remote_identity.feedback.loading_messages">Loading your messages, please wait.</Trans>
        </div>
        <Button
          disabled="$ctrl.remoteIdentity.cancel_fetch_required"
          onClick={this.handleDisconnect}
          color="alert"
        >
          <Trans id="remote_identity.action.cancel">Cancel</Trans>
        </Button>
      </div>
    );
  }

  renderFormPhase1() {
    const { i18n } = this.props;

    return (
      <div>
        <TextFieldGroup
          label={i18n._('remote_identity.form.login.label', { defaults: 'Login:' })}
          value={this.state.remoteIdentity.params.login}
          errors={this.state.formErrors.login}
          onChange={this.handleParamsChange}
          name="login"
          required
        />
        <TextFieldGroup
          label={i18n._('remote_identity.form.password.label', { defaults: 'Password:' })}
          type="password"
          value={this.state.remoteIdentity.params.password}
          errors={this.state.formErrors.password}
          onChange={this.handleParamsChange}
          name="password"
          required
        />
      </div>
    );
  }

  renderFormPhase2() {
    const { i18n } = this.props;

    return (
      <div>
        <SelectFieldGroup
          label={i18n._('remote_identity.form.protocol.label', { defaults: 'Protocol:' })}
          value={this.state.remoteIdentity.params.mailProtocol}
          options={MAIL_PROTOCOLS.map(key => ({ value: key, label: key }))}
          errors={this.state.formErrors.mailProtocol}
          onChange={this.handleParamsChange}
          name="mailProtocol"
          required
        />
        <TextFieldGroup
          label={i18n._('remote_identity.form.incomming_mail_server.label', { defaults: 'Incoming mail server:' })}
          value={this.state.remoteIdentity.params.incommingMailServer}
          errors={this.state.formErrors.incommingMailServer}
          onChange={this.handleParamsChange}
          name="incommingMailServer"
          required
        />
        <TextFieldGroup
          label={i18n._('remote_identity.form.port.label', { defaults: 'Port:' })}
          value={this.state.remoteIdentity.params.mailPort}
          errors={this.state.formErrors.mailPort}
          onChange={this.handleParamsChange}
          name="mailPort"
          required
        />
      </div>
    );
  }

  renderFormPhase3() {
    const fetchMethods = FETCH_METHODS.map(fetchMethod => ({
      value: fetchMethod,
      label: this.translations[fetchMethod],
    }));

    return (
      <div>
        <RadioFieldGroup
          value={this.state.remoteIdentity.params.fetchMethod}
          options={fetchMethods}
          errors={this.state.formErrors.fetchMethod}
          onChange={this.handleParamsChange}
          name="fetchMethod"
        />
      </div>
    );
  }

  renderForm() {
    let formPhase;

    switch (this.state.phase) {
      default:
      case 1:
        formPhase = this.renderFormPhase1;
        break;
      case 2:
        formPhase = this.renderFormPhase2;
        break;
      case 3:
        formPhase = this.renderFormPhase3;
        break;
    }

    return (
      <form className="m-remote-identity__form">
        {formPhase()}
        <div>
          {this.state.remoteIdentity.connected && (
            <Button
              disabled={this.state.remoteIdentity.cancel_fetch_required}
              onClick={this.handleDisconnect}
              color="alert"
            >
              <Trans id="remote_identity.action.disconnect">Disconnect</Trans>
            </Button>
          )}
          {this.state.phase > 1 && (
            <Button onClick={this.handleClickPrevious} shape="hollow">
              <Trans id="remote_identity.action.back">Previous</Trans>
            </Button>
          )}
          {this.state.phase < MAX_PHASE && (
            <Button shape="plain" onClick={this.handleClickNext}>
              <Trans id="remote_identity.action.next">Next</Trans>
            </Button>
          )}
          {this.state.phase === MAX_PHASE && (
            <Button onClick={this.handleClickFinish} shape="plain" color="secondary">
              <Trans id="remote_identity.action.finish">Connect</Trans>
            </Button>
          )}
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="m-remote-identity">
        <h4 className="m-remote-identity__title">
          <Trans id="remote_identity.form_legend">Connect an email server</Trans>
        </h4>
        {
          this.state.remoteIdentity &&
            this.state.remoteIdentity.is_fetching &&
            this.renderFetchingPanel()
        }
        {
          (!this.state.remoteIdentity || !this.state.remoteIdentity.is_fetching) &&
            this.renderForm()
        }
      </div>
    );
  }
}

export default RemoteIdentityEmail;
