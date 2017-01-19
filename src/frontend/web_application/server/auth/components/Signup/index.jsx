import React, { PropTypes } from 'react';
import SignupForm from '../../../../src/components/SignupForm';
import AuthPage from '../../../../src/layouts/AuthPage';

const Login = ({ form, errors = {}, formValues = {}, devInfos = {} }) => (
  <AuthPage {...devInfos}>
    <SignupForm form={form} errors={errors} formValues={formValues} />
  </AuthPage>
);

Login.propTypes = {
  form: PropTypes.shape({}),
  formValues: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  devInfos: PropTypes.shape({}),
};

export default Login;
