import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import { Confirm, Button, TextFieldGroup, SelectFieldGroup, CheckboxFieldGroup, FormGrid, FormRow, FormColumn } from '../../../../components';
import LastConnection from '../LastConnection';
import './style.scss';

const MAX_PHASE = 3;
const MAIL_PROTOCOLS = ['imap'];
const REMOTE_IDENTITY_STATUS = ['active', 'inactive'];

function generateStateFromProps(props, prevState) {
  const {
    remoteIdentity: {
      remote_id: remoteId, infos, credentials, status, type,
      display_name: displayName = prevState.remoteIdentity.displayName,
    },
  } = props;
  const [serverHostname = '', serverPort = ''] = infos && infos.server ? infos.server.split(':') : [];
  const active = status ? status === REMOTE_IDENTITY_STATUS[0] : prevState.remoteIdentity.active;
  const typeProtocol = type || prevState.remoteIdentity.type;

  return {
    phase: remoteId ? 0 : 1,
    remoteIdentity: {
      ...prevState.remoteIdentity,
      displayName,
      serverHostname,
      serverPort,
      username: credentials ? credentials.username : '',
      password: credentials ? credentials.password : '',
      active,
      type: typeProtocol,
    },
  };
}

function getRemoteIdentityFromState(state, props) {
  const {
    remoteIdentity: {
      displayName, serverHostname, serverPort, username, password, active, type,
    },
  } = state;
  const { remoteIdentity } = props;
  const credentials = (username || password) ? {
    ...(remoteIdentity.credentials ? remoteIdentity.credentials : {}),
    username,
    password,
  } : undefined;

  return {
    ...remoteIdentity,
    display_name: displayName,
    infos: {
      ...(remoteIdentity.infos ? remoteIdentity.infos : {}),
      server: `${serverHostname}:${serverPort}`,
    },
    credentials,
    status: active ? 'active' : 'inactive',
    type,
  };
}

@withI18n()
class RemoteIdentityEmail extends Component {
  static propTypes = {
    remoteIdentity: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
  }

  state = {
    phase: 0,
    formErrors: {},
    remoteIdentity: {
      displayName: '',
      serverHostname: '',
      serverPort: '',
      username: '',
      password: '',
      active: true,
      type: 'imap',
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  handleEdit = () => {
    this.setState({ phase: 1 });
  }

  handleClickPrevious = () => {
    this.setState(prevState => ({
      phase: prevState.phase - 1,
    }));
  }

  handleClickNext = () => {
    if (this.validate({ phase: this.state.phase })) {
      this.setState(prevState => ({
        phase: prevState.phase + 1,
      }));
    }
  }

  handleSave = async () => {
    await this.props.onChange({
      remoteIdentity: getRemoteIdentityFromState(this.state, this.props),
    });
    this.setState({ phase: 0 });
  }

  handleDelete = () => {
    this.props.onDelete({ remoteIdentity: getRemoteIdentityFromState(this.state, this.props) });
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      phase: 0,
    }, () => {
      onCancel();
    });
  }

  handleParamsChange = (event) => {
    const { name, value } = event.target;

    this.setState(prevState => ({
      remoteIdentity: {
        ...prevState.remoteIdentity,
        [name]: value,
      },
    }));
  }

  handleActivate = (event) => {
    const { checked } = event.target;

    this.setState(prevState => ({
      remoteIdentity: {
        ...prevState.remoteIdentity,
        active: checked,
      },
    }), () => {
      this.props.onChange({ remoteIdentity: getRemoteIdentityFromState(this.state, this.props) });
    });
  }

  validate = ({ phase }) => {
    let isValid = true;

    const phaseValidation = (properties) => {
      properties.forEach(({ formProperty, error }) => {
        const value = !!this.state.remoteIdentity
          && this.state.remoteIdentity[formProperty];

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
        { formProperty: 'displayName', error: <Trans id="remote_identity.form.display_name.error">a name is required</Trans> },
      ]);
    }

    if (phase >= 3) {
      phaseValidation([
        { formProperty: 'username', error: <Trans id="remote_identity.form.username.error">login is required</Trans> },
        { formProperty: 'password', error: <Trans id="remote_identity.form.password.error">password is required</Trans> },
      ]);
    }

    if (phase >= 2) {
      phaseValidation([
        { formProperty: 'serverHostname', error: <Trans id="remote_identity.form.serverHostname.error">mail server is required</Trans> },
        { formProperty: 'serverPort', error: <Trans id="remote_identity.form.serverPort.error">port is required</Trans> },
        { formProperty: 'type', error: <Trans id="remote_identity.form.type.error">protocol is required</Trans> },
      ]);
    }

    return isValid;
  }

  renderStatus = (status) => {
    const statusLabels = {
      active: (<Trans id="remote_identity.status.active">Enabled</Trans>),
      inactive: (<Trans id="remote_identity.status.inactive">Disabled</Trans>),
    };

    return statusLabels[status];
  }

  renderFormPhase0() {
    const { remoteIdentity } = this.props;

    if (!remoteIdentity.remote_id) {
      return null;
    }

    return (
      <FormGrid>
        <FormRow>
          <FormColumn bottomSpace>
            <Trans id="remote_identity.last_connection">Last connection: <LastConnection lastCheck={remoteIdentity.last_check} /></Trans>
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn bottomSpace>
            <CheckboxFieldGroup
              checked={this.state.remoteIdentity.active}
              errors={this.state.formErrors.status}
              onChange={this.handleActivate}
              name="active"
              label={this.renderStatus(this.state.remoteIdentity.active ? 'active' : 'inactive')}
              displaySwitch
              showTextLabel
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }

  renderFormPhase1() {
    const { remoteIdentity, i18n } = this.props;

    return (
      <FormGrid>
        <FormRow>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label={<Trans id="remote_identity.form.display_name.label">Name:</Trans>}
              placeholder={i18n._('remote_identity.form.display_name.placeholder', { defaults: 'john@doe.tld' })}
              value={this.state.remoteIdentity.displayName}
              errors={this.state.formErrors.displayName}
              onChange={this.handleParamsChange}
              name="displayName"
              required
            />
          </FormColumn>
          <FormColumn bottomSpace>
            {remoteIdentity.remote_id && (
              <CheckboxFieldGroup
                value={this.state.remoteIdentity.active}
                errors={this.state.formErrors.status}
                onChange={this.handleParamsChange}
                name="active"
                label={this.renderStatus(this.state.remoteIdentity.active ? 'active' : 'inactive')}
                displaySwitch
                showTextLabel
              />
            )}
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }

  renderFormPhase2() {
    return (
      <FormGrid>
        <FormRow>
          <FormColumn bottomSpace>
            <SelectFieldGroup
              label={<Trans id="remote_identity.form.protocol.label">Protocol:</Trans>}
              value={this.state.remoteIdentity.type}
              options={MAIL_PROTOCOLS.map(key => ({ value: key, label: key }))}
              errors={this.state.formErrors.type}
              onChange={this.handleParamsChange}
              name="type"
              required
              disabled
            />
          </FormColumn>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label={<Trans id="remote_identity.form.incomming_mail_server.label">Incoming mail server:</Trans>}
              value={this.state.remoteIdentity.serverHostname}
              errors={this.state.formErrors.serverHostname}
              onChange={this.handleParamsChange}
              name="serverHostname"
              required
            />
          </FormColumn>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label={<Trans id="remote_identity.form.port.label">Port:</Trans>}
              value={this.state.remoteIdentity.serverPort}
              errors={this.state.formErrors.serverPort}
              onChange={this.handleParamsChange}
              name="serverPort"
              required
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }

  renderFormPhase3() {
    return (
      <FormGrid>
        <FormRow>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label={<Trans id="remote_identity.form.username.label">Login:</Trans>}
              value={this.state.remoteIdentity.username}
              errors={this.state.formErrors.username}
              onChange={this.handleParamsChange}
              name="username"
              autoComplete="off"
              required
            />
          </FormColumn>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label={<Trans id="remote_identity.form.password.label">Password:</Trans>}
              type="password"
              value={this.state.remoteIdentity.password}
              errors={this.state.formErrors.password}
              onChange={this.handleParamsChange}
              name="password"
              autoComplete="off"
              required
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }

  renderActionsCreate() {
    return (
      <div>
        {this.state.phase >= 1 && (
          <Button onClick={this.handleCancel} shape="plain" className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.cancel">Cancel</Trans>
          </Button>
        )}
        {this.state.phase > 1 && (
          <Button onClick={this.handleClickPrevious} shape="hollow" className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.back">Previous</Trans>
          </Button>
        )}
        {this.state.phase < MAX_PHASE && (
          <Button shape="plain" onClick={this.handleClickNext} className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.next">Next</Trans>
          </Button>
        )}
        {this.state.phase === MAX_PHASE && (
          <Button onClick={this.handleSave} shape="plain" color="secondary" className="m-remote-identity-email__action m-remote-identity-email__action--push-right">
            <Trans id="remote_identity.action.finish">Connect</Trans>
          </Button>
        )}
      </div>
    );
  }

  renderActionsEdit() {
    return (
      <div>
        <Confirm
          title={<Trans id="remote_identity.confirm-delete.title">Delete the external account</Trans>}
          content={<Trans id="remote_identity.confirm-delete.content">The external account will deactivated then deleted.</Trans>}
          onConfirm={this.handleDelete}
          render={confirm => (
            <Button onClick={confirm} shape="plain" color="alert" className="m-remote-identity-email__action">
              <Trans id="remote_identity.action.delete">Delete</Trans>
            </Button>
          )}
        />
        {this.state.phase === 0 && (
          <Button onClick={this.handleEdit} shape="hollow" className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.edit">Edit</Trans>
          </Button>
        )}
        {this.state.phase >= 1 && (
          <Button onClick={this.handleCancel} shape="hollow" className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.cancel">Cancel</Trans>
          </Button>
        )}
        {this.state.phase > 1 && (
          <Button onClick={this.handleClickPrevious} shape="hollow" className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.back">Previous</Trans>
          </Button>
        )}
        {this.state.phase >= 1 && this.state.phase < MAX_PHASE && (
          <Button shape="plain" onClick={this.handleClickNext} className="m-remote-identity-email__action">
            <Trans id="remote_identity.action.next">Next</Trans>
          </Button>
        )}
        {this.state.phase >= 1 && (
          <Button onClick={this.handleSave} shape="plain" className="m-remote-identity-email__action m-remote-identity-email__action--push-right">
            <Trans id="remote_identity.action.save">Save</Trans>
          </Button>
        )}
      </div>
    );
  }

  renderActions() {
    const { remoteIdentity } = this.props;

    if (remoteIdentity && remoteIdentity.remote_id) {
      return this.renderActionsEdit();
    }

    return this.renderActionsCreate();
  }

  renderPhase() {
    switch (this.state.phase) {
      default:
      case 0:
        return this.renderFormPhase0();
      case 1:
        return this.renderFormPhase1();
      case 2:
        return this.renderFormPhase2();
      case 3:
        return this.renderFormPhase3();
    }
  }

  render() {
    return (
      <div className="m-remote-identity-email">
        {this.renderPhase()}
        {this.renderActions()}
      </div>
    );
  }
}

export default RemoteIdentityEmail;
