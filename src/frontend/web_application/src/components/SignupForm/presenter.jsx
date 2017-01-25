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
    onSubmit: PropTypes.func,
    __: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        username: '',
        password: '',
        tos: false,
      },
      passwordStrength: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: value,
      },
    }));
  }

  handleCheckboxChange(event) {
    const { name, checked } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: checked,
      },
    }));
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  }

  render() {
    const { form, errors = {}, __ } = this.props;

    return (
      <div className="s-signup">
        <FormGrid className="s-signup__form" name="ac_form" {...form}>
          <FormRow>
            <FormColumn className="s-signup__title" bottomSpace>
              <Title>{__('signup.title')}</Title>
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
                id="signup_username"
                name="username"
                label={__('signup.form.username.label')}
                placeholder={__('signup.form.username.placeholder')}
                value={this.state.formValues.username}
                errors={errors.username}
                onChange={this.handleInputChange}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn bottomSpace>
              <TextFieldGroup
                id="signup_password"
                name="password"
                label={__('signup.form.password.label')}
                placeholder={__('signup.form.password.placeholder')}
                showLabelforSr
                type="password"
                value={this.state.formValues.password}
                errors={errors.password}
                onChange={this.handleInputChange}
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
                id="signup_tos"
                label={__('signup.form.tos.label')}
                name="tos"
                checked={this.state.formValues.tos}
                errors={errors.tos}
                onChange={this.handleCheckboxChange}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn className="m-im-form__action">
              <Button
                type="submit"
                onClick={this.handleSubmit}
                expanded
                plain
              >{__('signup.action.create')}</Button>
            </FormColumn>
          </FormRow>
        </FormGrid>
      </div>
    );
  }
}

export default SignupForm;
