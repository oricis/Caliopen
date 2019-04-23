import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import SigninForm from './components/SigninForm';
import getClient from '../../services/api-client';
import { STATUS_VERIFIED } from '../../modules/device';

const URL_DEVICES = '/settings/new-device';

const getRedirect = (queryString) => {
  const paramRedirect = queryString.split(/[?|&]/).find(str => /^redirect/.test(str));

  return paramRedirect ? paramRedirect.split('=')[1] : undefined;
};

class Signin extends Component {
  static propTypes = {
    location: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
    clientDevice: PropTypes.shape({}),
  };

  static defaultProps = {
    clientDevice: undefined,
  };

  state = {
    errors: {},
    isAuthenticated: false,
  };

  componentWillMount() {
    this.initTranslation();
  }

  handleSignin = (context, formValues) => {
    const { clientDevice: device } = this.props;

    getClient().post('/auth/signin', {
      context,
      ...formValues,
      device,
    }).then(this.handleSigninSuccess, this.handleSigninError);
  }

  handleSigninSuccess = async (response) => {
    const nextState = {
      isAuthenticated: true,
    };

    if (response.data.device.status !== STATUS_VERIFIED) {
      nextState.redirectDevice = true;
    }

    this.setState(nextState);
  }

  handleSigninError = (err) => {
    const isExpectedError = err.response &&
      err.response.status >= 400 &&
      err.response.status < 500 &&
      err.response.data.errors;

    if (isExpectedError) {
      this.setState({
        errors: { global: [this.localizedErrors.ERR_INVALID_GLOBAL] },
      });
    } else {
      throw err;
    }
  }

  handleChange = () => {
    this.setState({ errors: {} });
  }

  initTranslation() {
    const { i18n } = this.props;
    this.localizedErrors = {
      ERR_REQUIRED_USERNAME: i18n._('signin.feedback.required_username', null, { defaults: 'A username is required' }),
      ERR_REQUIRED_PASSWORD: i18n._('signin.feedback.required_password', null, { defaults: 'A password is required' }),
      ERR_INVALID_GLOBAL: i18n._('signin.feedback.invalid', null, { defaults: 'Credentials are invalid' }),
    };
  }

  render() {
    const { location: { search } } = this.props;
    const redirect = getRedirect(search) || '/';

    if (this.state.isAuthenticated && this.state.redirectDevice && !redirect.includes('/validate-device/')) {
      return <Redirect push to={URL_DEVICES} />;
    }

    if (this.state.isAuthenticated) {
      return <Redirect push to={redirect} />;
    }

    return (
      <SigninForm
        onChange={this.handleChange}
        onSubmit={this.handleSignin}
        errors={this.state.errors}
      />
    );
  }
}

export default Signin;
