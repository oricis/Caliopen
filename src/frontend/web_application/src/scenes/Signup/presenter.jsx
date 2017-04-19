import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SignupForm from '../../components/SignupForm';
import formValidator, { getLocalizedErrors } from './form-validator';

const INVALID_FORM_REJECTION = 'INVALID_FORM_REJECTION';

class Signup extends Component {
  static propTypes = {
    onSignupSuccess: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleUsernameBlur = this.handleUsernameBlur.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleSignupSuccess = this.handleSignupSuccess.bind(this);
    this.handleSignupError = this.handleSignupError.bind(this);
  }

  updateErrorsState(fieldname, errorType, isValid) {
    this.setState((prevState) => {
      let fieldErrors = prevState.errors[fieldname] ? [...prevState.errors[fieldname]] : [];
      fieldErrors = fieldErrors.filter(msg => msg !== this.localizedErrors[errorType]);

      if (!isValid) {
        fieldErrors.push(this.localizedErrors[errorType]);
      }

      return {
        errors: {
          ...prevState.errors,
          [fieldname]: fieldErrors,
        },
      };
    });
  }

  resetErrorsState(fieldname) {
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        [fieldname]: [],
      },
    }));
  }


  handleUsernameChange(ev) {
    const { value: username } = ev.target;
    if (username.length === 0) {
      this.resetErrorsState('username');
    }

    if (username.length >= 3) {
      this.resetErrorsState('username');
      const { __ } = this.props;
      formValidator.validate({ username }, __, 'username').catch(
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

  handleUsernameBlur(ev) {
    const { value: username } = ev.target;
    if (username.length === 0) {
      this.resetErrorsState('username');

      return;
    }

    const { __ } = this.props;

    formValidator.validate({ username }, __, 'usernameAvailability').catch((errors) => {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          ...errors,
        },
      }));
    });
  }

  checkRequiredFields(formValues) {
    this.updateErrorsState('username', 'ERR_REQUIRED_USERNAME', formValues.username.length !== 0);
    this.updateErrorsState('password', 'ERR_REQUIRED_PASSWORD', formValues.password.length !== 0);
    this.updateErrorsState('tos', 'ERR_REQUIRED_TOS', formValues.tos === true);
  }

  handleSignup(ev) {
    const { __ } = this.props;
    formValidator.validate(ev.formValues, __, 'full')
      .catch((errors) => {
        this.setState({ errors });

        return Promise.reject(INVALID_FORM_REJECTION);
      })
      .then(() => axios.post('/auth/signup', {
        ...ev.formValues,
      }, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      }))
      .then(this.handleSignupSuccess, this.handleSignupError);
  }

  handleSignupSuccess() {
    const { onSignupSuccess } = this.props;
    onSignupSuccess('/');
  }

  handleSignupError(err) {
    if (err === INVALID_FORM_REJECTION) {
      return;
    }

    const isExpectedError = err.response &&
      err.response.status >= 400 &&
      err.response.status < 500 &&
      err.response.data.errors;

    if (!isExpectedError) {
      throw err;
    }

    const { __ } = this.props;
    const localizedErrors = getLocalizedErrors(__);

    const getLocalizedError = (msg, field) =>
      localizedErrors[`${msg}_${field.toUpperCase()}`];

    const { errors } = err.response.data;
    const global = Object.keys(errors).reduce((prev, field) => ([
      ...prev,
      ...errors[field].map(msg => getLocalizedError(msg, field)),
    ]), []);
    this.setState({ errors: { global } });
  }

  render() {
    return (
      <SignupForm
        onUsernameChange={this.handleUsernameChange}
        onUsernameBlur={this.handleUsernameBlur}
        onSubmit={this.handleSignup}
        errors={this.state.errors}
      />
    );
  }
}

export default Signup;
