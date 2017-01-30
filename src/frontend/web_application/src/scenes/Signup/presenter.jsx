import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import SignupForm from '../../components/SignupForm';
import usernameValidity, { ERR_MIN_MAX, ERR_INVALID_CHARACTER, ERR_DOTS, ERR_DOUBLE_DOTS } from '../../services/username-utils/username-validity';

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
    this.initTranslation();
  }

  initTranslation() {
    const { __ } = this.props;
    this.localizedErrors = {
      ERR_REQUIRED_USERNAME: __('signup.feedback.required_username'),
      [ERR_MIN_MAX]: __('signup.feedback.username_length'),
      [ERR_INVALID_CHARACTER]: __('signup.feedback.username_invalid_characters'),
      [ERR_DOTS]: __('signup.feedback.username_starting_ending_dot'),
      [ERR_DOUBLE_DOTS]: __('signup.feedback.username_double_dots'),
      ERR_UNAVAILABLE_USERNAME: __('signup.feedback.unavailable_username'),
      ERR_REQUIRED_PASSWORD: __('signup.feedback.required_password'),
      ERR_REQUIRED_TOS: __('signup.feedback.required_tos'),
      ERR_INVALID_GLOBAL: __('signup.feedback.invalid'),
    };
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
      usernameValidity.isValid(username).then(
        () => this.resetErrorsState('username'),
        validatorErrors => validatorErrors.fields.username.map(err => err.message)
          .forEach(type => this.updateErrorsState('username', type, false))
      );
    }
  }

  handleUsernameBlur(ev) {
    const { value: username } = ev.target;
    if (username.length === 0) {
      this.resetErrorsState('username');

      return;
    }

    const checkAvailability = () => axios.get('/api/v2/username/isAvailable', {
      params: { username },
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then((response) => {
      this.updateErrorsState('username', 'ERR_UNAVAILABLE_USERNAME', response.data.available);
    });
    const manageValidationErrors = validatorErrors => validatorErrors.fields.username
      .map(err => err.message)
      .forEach(type => this.updateErrorsState('username', type, false));

    usernameValidity.isValid(username).then(checkAvailability, manageValidationErrors);
  }

  checkRequiredFields(formValues) {
    this.updateErrorsState('username', 'ERR_REQUIRED_USERNAME', formValues.username.length !== 0);
    this.updateErrorsState('password', 'ERR_REQUIRED_PASSWORD', formValues.password.length !== 0);
    this.updateErrorsState('tos', 'ERR_REQUIRED_TOS', formValues.tos === true);
  }

  isFormValid() {
    return Object.keys(this.state.errors)
      .map(fieldname => this.state.errors[fieldname].length)
      .filter(len => len !== 0)
      .length === 0;
  }

  handleSignup(ev) {
    this.checkRequiredFields(ev.formValues);
    if (this.isFormValid()) {
      axios.post('/auth/signup', {
        ...ev.formValues,
      }, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      }).then(this.handleSignupSuccess, this.handleSignupError);
    }
  }

  handleSignupSuccess() {
    const { onSignupSuccess } = this.props;
    onSignupSuccess('/');
  }

  handleSignupError(err) {
    const isExpectedError = err.response &&
      err.response.status >= 400 &&
      err.response.status < 500 &&
      err.response.data.errors;

    const getLocalizedError = (msg, field) => this.localizedErrors[`${msg}_${field.toUpperCase()}`];

    if (isExpectedError) {
      const { errors } = err.response.data;
      const localizedErrors = Object.keys(errors).reduce((prev, field) => (
        { ...prev, [field]: errors[field].map(msg => getLocalizedError(msg, field)) }
      ), {});
      this.setState({ errors: localizedErrors });
    } else {
      throw err;
    }
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
