import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { RadioFieldGroup, Button, Section, FormGrid, FormRow, FormColumn } from '../../../../components';
import RemoteIdentityEmail from '../RemoteIdentityEmail';

function generateStateFromProps({ remoteIdentity }) {
  return { remoteIdentity };
}

class IdentityForm extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    remoteIdentity: PropTypes.shape({}),
    onRemoteIdentityChange: PropTypes.func.isRequired,
    onRemoteIdentityDelete: PropTypes.func.isRequired,
  };
  static defaultProps = {
    remoteIdentity: undefined,
  };

  state = {
    type: 'imap',
    remoteIdentity: undefined,
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
  }

  handleCreateChange = (event) => {
    const {
      target: {
        name, type, checked, value: inputValue,
      },
    } = event;
    const value = type === 'checkbox' ? checked : inputValue;

    this.setState({
      [name]: value,
    });
  }

  handleCreate = () => {
    this.setState(prevState => ({
      remoteIdentity: {
        type: prevState.type,
      },
    }));
  }

  handleCancel = () => {
    this.setState(generateStateFromProps(this.props));
  }

  renderType(remoteIdentity) {
    const {
      onRemoteIdentityChange,
      onRemoteIdentityDelete,
    } = this.props;

    switch (remoteIdentity.type) {
      default:
      case 'imap':
        return (
          <RemoteIdentityEmail
            remoteIdentity={remoteIdentity}
            onChange={onRemoteIdentityChange}
            onDelete={onRemoteIdentityDelete}
            onCancel={this.handleCancel}
          />
        );
    }
  }

  renderCreate() {
    const options = [
      { value: 'imap', label: (<Trans>Mail</Trans>) },
    ];

    return (
      <Section
        title={(<Trans>Add an external account</Trans>)}
      >
        <FormGrid>
          <FormRow>
            <FormColumn bottomSpace>
              <ul>
                <li>
                  <RadioFieldGroup
                    onChange={this.handleCreateChange}
                    value={this.state.type}
                    options={options}
                    name="type"
                  />
                </li>
              </ul>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn bottomSpace>
              <Button onClick={this.handleCreate} shape="plain"><Trans>Continue</Trans></Button>
            </FormColumn>
          </FormRow>
        </FormGrid>
      </Section>
    );
  }

  render() {
    if (this.state.remoteIdentity) {
      const context = this.state.remoteIdentity.status === 'active' ? 'safe' : 'disabled';

      return (
        <Section
          title={(<Trans>{this.state.remoteIdentity.display_name}</Trans>)}
          borderContext={context}
        >
          {this.renderType(this.state.remoteIdentity)}
        </Section>
      );
    }

    return this.renderCreate();
  }
}

export default IdentityForm;
