import React, { PropTypes } from 'react';
import './style.scss';

const AuthPage = ({ version, login, password, children }) => (
  <div className="l-auth-page">
    <header className="l-auth-page__header">
      {version && (<div>Current version: {version}</div>)}
      {(login || password) && (
        <div>Demo instance credentials: {login} / {password}</div>
      )}
    </header>
    <section>{children}</section>
    <footer className="l-auth-page__footer">Be good</footer>
  </div>
);

AuthPage.propTypes = {
  children: PropTypes.node,
  version: PropTypes.string,
  login: PropTypes.string,
  password: PropTypes.string,
};

export default AuthPage;
