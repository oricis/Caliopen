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
        passwordStrenght: 'moderate',
      },
      errors: [],
    };
  }

  render() {
    return (
      <div className="s-signup">
        <Brand />
        <FormGrid className="m-signup-form" name="ac_form">
          <Fieldset>
            <FormRow>
              <FormColumn size="expand">
                <Title>Create your account</Title>
              </FormColumn>
            </FormRow>
            {this.state.errors.length !== 0 && (
              <FormRow>
                <FormColumn size="fluid">
                  <FieldErrors className="m-signup-form__errors" errors={this.state.errors} />
                </FormColumn>
              </FormRow>
            )}
            <FormRow>
              <FormColumn>
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
              <FormColumn size="expand" className="m-signup-form__terms m-im-form__action">
                <Switch label="I agree Terms and conditions" duplicateLabel />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn size="expand" className="m-im-form__action">
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
