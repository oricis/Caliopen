import React from 'react';
import PropTypes from 'prop-types';
import Brand from '../../components/Brand';
import './style.scss';

const DEV_INFOS = {
  version: '0.1.0',
  login: 'john',
  password: '123456',
};

// XXX: use dev username for now. We should use poc_fixtures next time
if (CALIOPEN_ENV === 'development' || true) {
  DEV_INFOS.login = 'dev';
}

const AuthPage = ({ children }) => (
  <div className="l-auth-page">
    <header className="l-auth-page__header">
      <Brand className="l-auth-page__brand" />
    </header>
    <section className="l-auth-page__form">{children}</section>
    <footer className="l-auth-page__footer">
      {DEV_INFOS.version && (<div>Current version: {DEV_INFOS.version}</div>)}
      {(DEV_INFOS.login || DEV_INFOS.password) && (
        <div>Demo instance credentials: {DEV_INFOS.login} / {DEV_INFOS.password}</div>
      )}
      Be good
    </footer>
  </div>
);

AuthPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthPage;
