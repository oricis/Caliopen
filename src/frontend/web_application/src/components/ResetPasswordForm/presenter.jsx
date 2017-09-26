import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PasswordStrength, TextFieldGroup, FormGrid, FieldErrors, FormColumn, FormRow } from '../form';
import Section from '../Section';
import Button from '../Button';
import Icon from '../Icon';

import './style.scss';

class ResetPasswordForm extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    success: PropTypes.bool,
  };

  static defaultProps = {
    errors: {},
    success: false,
  };

  state = {
    formErrors: {
      passwordError: [],
    },
    confirmPassword: '',
    passwordStrength: '',
    formValues: {
      password: '',
    },
  }

  componentDidMount() {
    import('zxcvbn').then((zxcvbn) => {
      this.zxcvbn = zxcvbn;
    });
  }

  calcPasswordStrengh = () => {
    if (this.zxcvbn) {
      this.setState((prevState) => {
        const { password } = prevState.formValues;
        const passwordStrength = !password.length ? '' : this.zxcvbn(password).score;

        return {
          ...prevState,
          passwordStrength,
        };
      });
    }
  }

  handlePasswordChange = (event) => {
    const value = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      formValues: {
        password: value,
      },
    }));
    this.calcPasswordStrengh();
  }

  handleConfirmPasswordChange = (event) => {
    const { __ } = this.props;
    const value = event.target.value;

    this.setState((prevState) => {
      const password = prevState.formValues.password;
      const error = __('password.form.new_password_confirmation.error');
      const passwordError = password === value ? [] : [error];

      return {
        confirmPassword: value,
        formErrors: {
          passwordError,
        },
      };
    });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  }

  render() {
    const { __, errors, success } = this.props;

    const submitButtonProps = {
      // enable submitButton only if password and confirmPassword are matching
      disabled: this.state.formValues.password !== '' &&
      (this.state.formValues.password === this.state.confirmPassword) ? null : true,
    };

    return (
      <Section title={__('password.reset-form.title')} className="m-reset-password-form">
        {success ? (
          <div className="m-reset-password-form__success">
            <Icon type="check" rightSpaced />{__('password.reset-form.success')}
          </div>
        ) : (
          <FormGrid className="m-reset-password-form">
            <form method="post" name="reset-password-form" onSubmit={this.handleSubmit}>
              {errors.global && (
                <FormRow>
                  <FormColumn rightSpace={false} bottomSpace>
                    <FieldErrors errors={errors.global} />
                  </FormColumn>
                </FormRow>
              )}
              <FormRow>
                <FormColumn rightSpace={false} bottomSpace>
                  <TextFieldGroup
                    name="password"
                    type="password"
                    value={this.state.formValues.password}
                    onChange={this.handlePasswordChange}
                    label={__('password.form.new_password.label')}
                    placeholder={__('password.form.new_password.placeholder')}
                    required
                  />
                </FormColumn>
                {this.state.passwordStrength.length !== 0 && (
                  <FormColumn rightSpace={false} bottomSpace>
                    <PasswordStrength strength={this.state.passwordStrength} />
                  </FormColumn>
                )}
                <FormColumn rightSpace={false} bottomSpace>
                  <TextFieldGroup
                    name="confirmPassword"
                    type="password"
                    value={this.state.confirmPassword}
                    onChange={this.handleConfirmPasswordChange}
                    errors={this.state.formErrors.passwordError}
                    label={__('password.form.new_password_confirmation.label')}
                    placeholder={__('password.form.new_password_confirmation.placeholder')}
                    required
                  />
                </FormColumn>
                <FormColumn className="m-reset-password-form__action" rightSpace={false}>
                  <Button shape="plain" display="expanded" type="submit" {...submitButtonProps}>
                    {__('password.form.action.validate')}
                  </Button>
                </FormColumn>
              </FormRow>
            </form>
          </FormGrid>
        )}

      </Section>
    );
  }
}

export default ResetPasswordForm;
