import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import ForgotPasswordForm from '../../components/ForgotPasswordForm';

class ForgotPassword extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  state = {
    errors: {},
    isSuccess: false,
  };

  handleSuccess = () => {
    this.setState({ isSuccess: true });
  }

  /* handleError = () => {

  } */

  handleProcessForm = (/* ev */) => {
    // TODO: process forgot password form

    /* axios.post('/auth/forgot-password', {
      ...ev.formValues,
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(this.handleSuccess, this.handleError);
    */
  }

  render() {
    return (
      <ForgotPasswordForm
        onSubmit={this.handleSuccess} // should be this.handleProcessForm
        errors={this.state.errors}
        success={this.state.isSuccess}
      />
    );
  }
}

export default ForgotPassword;
