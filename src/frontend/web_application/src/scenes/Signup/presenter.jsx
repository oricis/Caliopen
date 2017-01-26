import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import SignupForm from '../../components/SignupForm';
import usernameValidity from '../../services/username-utils/username-validity';

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
      ERR_INVALID_USERNAME: __('signup.feedback.invalid_username'),
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
      this.updateErrorsState('username', 'ERR_INVALID_USERNAME', usernameValidity.isValid(ev.target.value));
    }
  }

  handleUsernameBlur(ev) {
    const { value: username } = ev.target;
    if (username.length === 0) {
      this.resetErrorsState('username');

      return;
    }

    if (!usernameValidity.isValid(username)) {
      this.updateErrorsState('username', 'ERR_INVALID_USERNAME', false);

      return;
    }

    axios.get('/api/v2/username/isAvailable', { params: { username } }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then((response) => {
      this.updateErrorsState('username', 'ERR_UNAVAILABLE_USERNAME', response.data.available);
    });
  }

  handleSignup(ev) {
    axios.post('/auth/signup', {
      ...ev.formValues,
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(this.handleSignupSuccess, this.handleSignupError);
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
