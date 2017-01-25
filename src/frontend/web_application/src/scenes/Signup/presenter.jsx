import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import SignupForm from '../../components/SignupForm';

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
    this.handleSignup = this.handleSignup.bind(this);
    this.handleSignupSuccess = this.handleSignupSuccess.bind(this);
    this.handleSignupError = this.handleSignupError.bind(this);
    this.initTranslation();
  }

  initTranslation() {
    const { __ } = this.props;
    this.localizedErrors = {
      ERR_REQUIRED_USERNAME: __('signup.feedback.required_username'),
      ERR_REQUIRED_PASSWORD: __('signup.feedback.required_password'),
      ERR_REQUIRED_TOS: __('signup.feedback.required_tos'),
      ERR_INVALID_GLOBAL: __('signup.feedback.invalid'),
    };
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
      <SignupForm onSubmit={this.handleSignup} errors={this.state.errors} />
    );
  }
}

export default Signup;
