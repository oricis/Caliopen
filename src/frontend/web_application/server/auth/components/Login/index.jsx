import React, { PropTypes } from 'react';
import LoginForm from '../../../../src/components/LoginForm';
import AuthPage from '../../../../src/layouts/AuthPage';

const Login = ({ form, login = {}, devInfos = {} }) => (
  <AuthPage {...devInfos}>
    <LoginForm form={form} {...login} />
  </AuthPage>
);

Login.propTypes = {
  form: PropTypes.shape({}),
  login: PropTypes.shape({}),
  devInfos: PropTypes.shape({}),
};

export default Login;
