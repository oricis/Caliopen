import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import PasswordResetForm from '../../components/PasswordResetForm';


class ResetPassword extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  state = {
    errors: {},
    isSuccess: false,
  };

  /* handleResetPasswordSError = () => {} */

  handleResetPasswordSuccess = () => {
    this.setState({ isSuccess: true });
  }

  handleResetPassword = (/* ev */) => {
    // TODO: process reset password form

    /* axios.post('/auth/reset-password', {
      ...ev.formValues,
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(this.handleResetPasswordSuccess, this.handleResetPasswordSError);
    */
  }

  render() {
    return (
      <PasswordResetForm
        onSubmit={this.handleResetPasswordSuccess} // should be this.handleResetPassword
        errors={this.state.errors}
        success={this.state.isSuccess}
      />
    );
  }
}

export default ResetPassword;
