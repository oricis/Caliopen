import React, { Component } from 'react';
import Link from '../Link';
import Button from '../Button';
import Brand from '../Brand';
import Title from '../Title';
import { Fieldset, TextFieldGroup, FormGrid, FormRow, FormColumn, PasswordStrenght, Switch, FieldErrors } from '../form';
import './style.scss';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        passwordStrenght: '',
      },
      errors: [],
    };
  }

  render() {
    return (
      <FormGrid className="m-account-creation-form" name="ac_form">
        <Fieldset>
          <FormRow>
            <FormColumn className="m-account-creation-form__brand">
              <Brand />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="expand">
              <Title>Create your account</Title>
            </FormColumn>
          </FormRow>
          {this.state.errors.length !== 0 && (
            <FormRow>
              <FormColumn size="expand">
                <FieldErrors className="m-account-creation-form__errors" errors={this.state.errors} />
              </FormColumn>
            </FormRow>
          )}
          <FormRow>
            <FormColumn size="expand">
              <TextFieldGroup
                name="username"
                placeholder="username"
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="expand">
              <TextFieldGroup
                name="password"
                placeholder="password"
                type="password"
              />
              {this.state.props.passwordStrenght.length !== 0 && (
                <PasswordStrenght strenght={this.state.props.passwordStrenght} />
              )}
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="expand" className="m-account-creation-form__terms">
              <Switch label="I agree Terms and conditions" duplicateLabel />
            </FormColumn>
          </FormRow>
          <FormRow className="m-account-creation-form__submit">
            <FormColumn size="expand" className="m-im-form__action">
              <Button type="submit" expanded plain> Submit</Button>
            </FormColumn>
          </FormRow>
          <FormRow className="m-account-creation-form__submit">
            <FormColumn size="expand" className="m-im-form__action">
              <Link to="#">Cancel</Link>
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default SignupForm;
