import React, { PropTypes } from 'react';
import Brand from '../../components/Brand';
import './style.scss';

const AuthPage = ({ version, login, password, children }) => (
  <div className="l-auth-page">
    <header className="l-auth-page__header">
      <Brand className="l-auth-page__brand" />
    </header>
    <section className="l-auth-page__form">{children}</section>
    <footer className="l-auth-page__footer">
      {version && (<div>Current version: {version}</div>)}
      {(login || password) && (
        <div>Demo instance credentials: {login} / {password}</div>
      )}
      Be good
    </footer>
  </div>
);

AuthPage.propTypes = {
  children: PropTypes.node,
  version: PropTypes.string,
  login: PropTypes.string,
  password: PropTypes.string,
};

export default AuthPage;
