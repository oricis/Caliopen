import React, { PropTypes } from 'react';
import LoginForm from '../../../../src/components/LoginForm';
import AuthPage from '../../../../src/layouts/AuthPage';

const Login = ({ form, errors = {}, formValues = {}, devInfos = {} }) => (
  <AuthPage {...devInfos}>
    <LoginForm form={form} errors={errors} formValues={formValues} />
  </AuthPage>
);

Login.propTypes = {
  form: PropTypes.shape({}),
  formValues: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  devInfos: PropTypes.shape({}),
};

export default Login;
