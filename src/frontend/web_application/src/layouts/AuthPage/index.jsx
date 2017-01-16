import React, { PropTypes } from 'react';

const AuthPage = ({ version, login, password, children }) => (
  <div>
    <header>
      {version && (<div>Current version: {version}</div>)}
      {(login || password) && (
        <div>Demo instance credentials: {login} / {password}</div>
      )}
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
