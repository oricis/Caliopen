import React, { PropTypes } from 'react';

const AuthPage = ({ version, login, password, children }) => (
  <div>
    <header>
      <div>Current version: {version}</div>
      <div>Demo instance credentials: {login} / {password}</div>
    </header>
    <section>{children}</section>
    <footer>Be good</footer>
  </div>
);

AuthPage.propTypes = {
  children: PropTypes.node,
  version: PropTypes.string,
  login: PropTypes.string,
  password: PropTypes.string,
};

export default AuthPage;
