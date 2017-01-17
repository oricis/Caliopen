import React, { Component } from 'react';
import Button from '../Button';
import Brand from '../Brand';
import Title from '../Title';
import { TextFieldGroup, FormGrid, FormRow, FormColumn, PasswordStrength, Switch, FieldErrors } from '../form';
import './style.scss';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordStrength: '',
      errors: [],
    };
  }

  render() {
    return (
      <div className="s-signup">
        <Brand className="s-signup__brand" />
        <FormGrid className="s-signup__form" name="ac_form">
          <FormRow>
            <FormColumn className="s-signup__title" fluid>
              <Title>Create your account</Title>
            </FormColumn>
          </FormRow>
          {this.state.errors.length !== 0 && (
          <FormRow>
            <FormColumn fluid >
              <FieldErrors className="s-signup__global-errors" errors={this.state.errors} />
            </FormColumn>
          </FormRow>
          )}
          <FormRow>
            <FormColumn fluid >
              <TextFieldGroup
                name="username"
                label="Username"
                placeholder="username"
                errors={['test']}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <TextFieldGroup
                name="password"
                label="password"
                placeholder="password"
                showLabelforSr
                type="password"
              />
              {this.state.passwordStrength.length !== 0 && (
              <PasswordStrength strength={this.state.passwordStrength} />
              )}
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn className="s-signup__terms m-im-form__action">
              <Switch label="I agree Terms and conditions" duplicateLabel />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn className="m-im-form__action">
              <Button type="submit" expanded plain>Create</Button>
            </FormColumn>
          </FormRow>
        </FormGrid>
      </div>
    );
  }
}

export default SignupForm;
