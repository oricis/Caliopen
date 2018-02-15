import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WithDevice } from '../../modules/device';
import { signup } from '../../modules/user';
import SignupForm from './components/SignupForm';
import formValidator, { getLocalizedErrors, ERR_UNABLE_TO_SIGNUP } from './form-validator';

class Signup extends Component {
  static propTypes = {
    onSignupSuccess: PropTypes.func.isRequired,
    settings: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  state = {
    errors: {},
  };

  resetErrorsState(fieldname) {
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        [fieldname]: [],
      },
    }));
  }

  usernameHasChanged = (username) => {
    if (username.length === 0) {
      this.resetErrorsState('username');
    }

    if (username.length >= 3) {
      this.resetErrorsState('username');
      const { i18n } = this.props;
      formValidator.validate({ username }, i18n, 'username').catch(
        (errors) => {
          this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              ...errors,
            },
          }));
        }
      );
    }
  }

  handleFieldChange = (fieldname, value) => {
    switch (fieldname) {
      case 'username':
        this.usernameHasChanged(value);
        break;
      default:
        if (this.state.errors[fieldname]) {
          this.resetErrorsState(fieldname);
        }
    }
  }

  handleFieldBlur = (fieldname, value) => {
    if (fieldname !== 'username') {
      return;
    }

    if (value.length === 0) {
      this.resetErrorsState('username');

      return;
    }

    const { i18n } = this.props;

    formValidator.validate({ username: value }, i18n, 'usernameAvailability').catch((errors) => {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          ...errors,
        },
      }));
    });
  }

  handleSignup = async ({ device }, ev) => {
    const { i18n, settings } = this.props;
    try {
      await formValidator.validate(ev.formValues, i18n, 'full');
    } catch (errors) {
      this.setState({ errors });

      return undefined;
    }

    try {
      await signup({
        ...ev.formValues,
        device,
        settings,
      });
      const { onSignupSuccess } = this.props;

      return onSignupSuccess('/');
    } catch (err) {
      const isExpectedError = err.response &&
        err.response.status >= 400 &&
        err.response.status < 500;

      if (!isExpectedError) {
        throw err;
      }

      const localizedErrors = getLocalizedErrors(i18n);

      this.setState({ errors: { global: [localizedErrors[ERR_UNABLE_TO_SIGNUP]] } });

      return undefined;
    }
  }

  renderForm = (errors, device) => {
    const handleSignup = this.handleSignup.bind(null, { device });

    return (
      <SignupForm
        onFieldChange={this.handleFieldChange}
        onFieldBlur={this.handleFieldBlur}
        onSubmit={handleSignup}
        errors={errors}
      />
    );
  }

  render() {
    return (
      <WithDevice render={({ device }) => this.renderForm(this.state.errors, device)} />
    );
  }
}

export default Signup;
