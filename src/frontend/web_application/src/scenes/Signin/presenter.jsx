import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import SigninForm from './components/SigninForm';

function getRedirect(queryString) {
  const paramRedirect = queryString.split(/[?|&]/).find(str => /^redirect/.test(str));

  return paramRedirect ? paramRedirect.split('=')[1] : undefined;
}

class Signin extends Component {
  static propTypes = {
    location: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      isAuthenticated: false,
    };
    this.handleSignin = this.handleSignin.bind(this);
    this.handleSigninSuccess = this.handleSigninSuccess.bind(this);
    this.handleSigninError = this.handleSigninError.bind(this);
    this.initTranslation();
  }

  initTranslation() {
    const { i18n } = this.props;
    this.localizedErrors = {
      ERR_REQUIRED_USERNAME: i18n.t`signin.feedback.required_username`,
      ERR_REQUIRED_PASSWORD: i18n.t`signin.feedback.required_password`,
      ERR_INVALID_GLOBAL: i18n.t`signin.feedback.invalid`,
    };
  }

  handleSignin(ev) {
    axios.post('/auth/signin', {
      ...ev.formValues,
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(this.handleSigninSuccess, this.handleSigninError);
  }

  handleSigninSuccess() {
    this.setState({ isAuthenticated: true });
  }

  handleSigninError(err) {
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
    const { location: { search } } = this.props;
    const redirect = getRedirect(search) || '/';

    if (this.state.isAuthenticated) {
      return <Redirect push to={redirect} />;
    }

    return (
      <SigninForm onSubmit={this.handleSignin} errors={this.state.errors} />
    );
  }
}

export default Signin;
