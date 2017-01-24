import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Title from '../Title';
import { TextFieldGroup, FormGrid, FormRow, FormColumn, PasswordStrength, CheckboxFieldGroup, FieldErrors } from '../form';
import './style.scss';

function generateStateFromProps(props) {
  return {
    ...props.formValues,
  };
}

class SignupForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    form: PropTypes.shape({}),
    formValues: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      tos: false,
      passwordStrength: '',
    };
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  render() {
    const { form, errors = {} } = this.props;

    return (
      <div className="s-signup">
        <FormGrid className="s-signup__form" name="ac_form" {...form}>
          <FormRow>
            <FormColumn className="s-signup__title" bottomSpace>
              <Title>Create your account</Title>
            </FormColumn>
          </FormRow>
          {errors.global && errors.global.length !== 0 && (
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
                value={this.state.username}
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
                value={this.state.password}
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
              <CheckboxFieldGroup
                label="I agree Terms and conditions"
                name="tos"
                checked={this.state.tos}
                errors={errors.tos}
              />
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
