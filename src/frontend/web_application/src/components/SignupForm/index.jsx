import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Title from '../Title';
import { TextFieldGroup, FormGrid, FormRow, FormColumn, PasswordStrength, CheckboxFieldGroup, FieldErrors } from '../form';
import './style.scss';

class SignupForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    form: PropTypes.shape({}),
    formValues: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      passwordStrength: '',
    };
  }

  render() {
    const { form, errors } = this.props;

    return (
      <div className="s-signup">
        <FormGrid className="s-signup__form" name="ac_form" {...form}>
          <FormRow>
            <FormColumn className="s-signup__title" bottomSpace>
              <Title>Create your account</Title>
            </FormColumn>
          </FormRow>
          {this.state.errors.length !== 0 && (
          <FormRow>
            <FormColumn bottomSpace>
              <FieldErrors className="s-signup__global-errors" errors={errors.global} />
            </FormColumn>
          </FormRow>
          )}
          <FormRow>
            <FormColumn bottomSpace >
              <TextFieldGroup
                name="username"
                label="Username"
                placeholder="Username"
                errors={errors.username}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn bottomSpace>
              <TextFieldGroup
                name="password"
                label="Password"
                placeholder="Password"
                showLabelforSr
                type="password"
                errors={errors.password}
              />
            </FormColumn>
            {this.state.passwordStrength.length !== 0 && (
            <FormColumn bottomSpace>
              <PasswordStrength strength={this.state.passwordStrength} />
            </FormColumn>
            )}
          </FormRow>
          <FormRow>
            <FormColumn bottomSpace>
              <CheckboxFieldGroup label="I agree Terms and conditions" />
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
