import React, { Component } from 'react';
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
      <div className="s-signup">
        <Brand className="s-signup__brand" />
        <FormGrid className="m-signup-form" name="ac_form">
          <Fieldset>
            <FormRow>
              <FormColumn>
                <Title>Create your account</Title>
              </FormColumn>
            </FormRow>
            {this.state.errors.length !== 0 && (
              <FormRow>
                <FormColumn>
                  <FieldErrors className="m-signup-form__errors" errors={this.state.errors} />
                </FormColumn>
              </FormRow>
            )}
            <FormRow>
              <FormColumn>
                <TextFieldGroup
                  name="username"
                  label="Username"
                  placeholder="username"
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
                {this.state.props.passwordStrenght.length !== 0 && (
                  <PasswordStrenght strenght={this.state.props.passwordStrenght} />
                )}
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn className="m-signup-form__terms m-im-form__action">
                <Switch label="I agree Terms and conditions" duplicateLabel />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn className="m-im-form__action">
                <Button type="submit" expanded plain>Create</Button>
              </FormColumn>
            </FormRow>
          </Fieldset>
        </FormGrid>
      </div>
    );
  }
}

export default SignupForm;
