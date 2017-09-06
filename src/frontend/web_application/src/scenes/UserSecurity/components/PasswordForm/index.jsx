import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PasswordStrength, TextFieldGroup, FormGrid, FormColumn, FormRow } from '../../../../components/form';
import Button from '../../../../components/Button';
import './style.scss';

class PasswordForm extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    onCancel: str => str,
    onSubmit: str => str,
  };

  state = {
    formErrors: {},
    passwordStrength: '',
    formValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      tfa: '',
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
    this.handleInputChange(event);
    // FIXME: this.comparePasswords(); function to compare passwords and return error in state
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  }

  render() {
    const { __, onCancel } = this.props;

    return (
      <FormGrid className="m-password-form">
        <form method="post" name="password_form" onSubmit={this.handleSubmit}>
          <FormRow className="m-password-form__row">
            <FormColumn size="medium">
              <TextFieldGroup
                name="password"
                type="password"
                value={this.state.formValues.password}
                onChange={this.handleInputChange}
                label={__('password.form.current_password.label')}
                placeholder={__('password.form.current_password.placeholder')}
                required
              />
            </FormColumn>
            <FormColumn size="medium">
              <label htmlFor="password" className="m-password-form__tip">
                {__('password.form.current_password.tip')}
              </label>
            </FormColumn>
          </FormRow>
          <FormRow className="m-password-form__row">
            <FormColumn size="medium">
              <TextFieldGroup
                name="newPassword"
                type="password"
                value={this.state.formValues.newPassword}
                onChange={this.handleNewPasswordChange}
                label={__('password.form.new_password.label')}
                placeholder={__('password.form.new_password.placeholder')}
                required
              />
            </FormColumn>
            <FormColumn size="medium">
              <label htmlFor="newPassword" className="m-password-form__tip">
                {__('password.form.new_password.tip')}
              </label>
            </FormColumn>
            {this.state.passwordStrength.length !== 0 && (
              <FormColumn size="medium" bottomSpace>
                <PasswordStrength strength={this.state.passwordStrength} />
              </FormColumn>
            )}
          </FormRow>
          <FormRow className="m-password-form__row">
            <FormColumn size="medium">
              <TextFieldGroup
                name="confirmNewPassword"
                type="password"
                value={this.state.formValues.confirmNewPassword}
                onChange={this.handleConfirmPasswordChange}
                errors={this.state.formErrors.confirmNewPassword}
                label={__('password.form.new_password_confirmation.label')}
                placeholder={__('password.form.new_password_confirmation.placeholder')}
                required
              />
            </FormColumn>
          </FormRow>
          <FormRow className="m-password-form__row">
            <FormColumn size="medium">
              <TextFieldGroup
                name="tfa"
                value={this.state.formValues.taf}
                onChange={this.handleInputChange}
                label={__('password.form.tfa.label')}
                placeholder={__('password.form.tfa.placeholder')}
                disabled
              />
            </FormColumn>
            <FormColumn size="medium">
              <label htmlFor="newPassword" className="m-password-form__tip">
                {__('password.form.tfa.tip')}
              </label>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="medium" className="m-password-form__action" bottomSpace>
              <Button shape="plain" display="expanded" type="submit">{__('password.form.action.validate')}</Button>
            </FormColumn>
            <FormColumn size="shrink" className="m-password-form__action">
              <Button shape="hollow" display="expanded" onClick={onCancel}>{__('password.form.action.cancel')}</Button>
            </FormColumn>
          </FormRow>
        </form>
      </FormGrid>
    );
  }
}

export default PasswordForm;
