import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { PasswordStrength, TextFieldGroup, FormGrid, FormColumn, FormRow } from '../../../../components/form';
import Button from '../../../../components/Button';
import './style.scss';

class PasswordForm extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };


  state = {
    passwordError: [],
    passwordConfirmation: '',
    passwordStrength: '',
    formValues: {
      password: '',
      newPassword: '',
      // tfa: '',
    },
  }

  componentDidMount() {
    import(/* webpackChunkName: "zxcvbn" */ 'zxcvbn').then((zxcvbn) => {
      this.zxcvbn = zxcvbn;
    });
  }

  calcPasswordStrengh = () => {
    if (this.zxcvbn) {
      this.setState((prevState) => {
        const { newPassword } = prevState.formValues;
        const passwordStrength = !newPassword.length ? '' : this.zxcvbn(newPassword).score;

        return {
          ...prevState,
          passwordStrength,
        };
      });
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: value,
      },
    }));
  }

  handleNewPasswordChange = (event) => {
    this.handleInputChange(event);
    this.calcPasswordStrengh();
  }

  handleConfirmPasswordChange = (event) => {
    const { i18n } = this.props;
    const { value } = event.target;

    this.setState((prevState) => {
      const newPassword = prevState.formValues.newPassword;
      const error = i18n.t`password.form.new_password_confirmation.error`;
      const passwordError = newPassword === value ? [] : [error];

      return {
        ...prevState,
        passwordConfirmation: value,
        passwordError,
      };
    });
  }

  handleSubmit = () => {
    const { formValues } = this.state;
    const user = { password: formValues.newPassword };
    const original = { password: formValues.password };

    const data = {
      ...user,
      current_state: {
        ...original,
      },
    };

    this.props.onSubmit(data);
  }

  render() {
    const { i18n, onCancel } = this.props;

    const submitButtonProps = {
      disabled: this.state.formValues.newPassword !== '' && this.state.formValues.password !== '' &&
      (this.state.formValues.newPassword === this.state.passwordConfirmation) ? null : true,
    };

    return (
      <FormGrid className="m-password-form">
        <FormRow className="m-password-form__row">
          <FormColumn size="medium">
            <TextFieldGroup
              name="password"
              type="password"
              onChange={this.handleInputChange}
              label={i18n.t`password.form.current_password.label`}
              placeholder={i18n.t`password.form.current_password.placeholder`}
              showLabelforSr
              required
            />
          </FormColumn>
          <FormColumn size="medium">
            <label htmlFor="password" className="m-password-form__tip">
              <Trans id="password.form.current_password.tip">The password you want to replace.</Trans>
            </label>
          </FormColumn>
        </FormRow>
        <FormRow className="m-password-form__row">
          <FormColumn size="medium">
            <TextFieldGroup
              name="newPassword"
              type="password"
              onChange={this.handleNewPasswordChange}
              label={i18n.t`password.form.new_password.label`}
              placeholder={i18n.t`password.form.new_password.placeholder`}
              required
            />
          </FormColumn>
          <FormColumn size="medium">
            <label htmlFor="newPassword" className="m-password-form__tip">
              <Trans id="password.form.new_password.tip">The password you want to use from now.</Trans>
            </label>
          </FormColumn>
          {this.state.passwordStrength.length !== 0 && (
            <FormColumn size="medium" bottomSpace className="m-password-form__strength">
              <PasswordStrength strength={this.state.passwordStrength} />
            </FormColumn>
          )}
        </FormRow>
        <FormRow className="m-password-form__row">
          <FormColumn size="medium">
            <TextFieldGroup
              name="confirmNewPassword"
              type="password"
              onChange={this.handleConfirmPasswordChange}
              errors={this.state.passwordError}
              label={i18n.t`password.form.new_password_confirmation.label`}
              placeholder={i18n.t`password.form.new_password_confirmation.placeholder`}
              required
            />
          </FormColumn>
        </FormRow>
        {/*
          <FormRow className="m-password-form__row">
          <FormColumn size="medium">
            <Field
              name="tfa"
              component={TextFieldGroup}
              onChange={this.handleInputChange}
              label={i18n.t`password.form.tfa.label`}
              placeholder={i18n.t`password.form.tfa.placeholder`}
              disabled
            />
          </FormColumn>
          <FormColumn size="medium">
            <label htmlFor="newPassword" className="m-password-form__tip">
              <Trans id="password.form.tfa.tip">
                Only if you have enabled the 2-Factor Authentification method.
              </Trans>
            </label>
          </FormColumn>
        </FormRow>
        */}
        <FormRow>
          <FormColumn size="medium" className="m-password-form__action" bottomSpace>
            <Button shape="plain" display="expanded" onClick={this.handleSubmit} {...submitButtonProps}>
              <Trans id="password.form.action.validate">Apply modifications</Trans>
            </Button>
          </FormColumn>
          <FormColumn size="shrink" className="m-password-form__action">
            <Button shape="hollow" display="expanded" onClick={onCancel}>
              <Trans id="password.form.action.cancel">Cancel</Trans>
            </Button>
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default PasswordForm;
