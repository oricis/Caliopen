import React from 'react';
import PropTypes from 'prop-types';
import Brand from '../../components/Brand';
import { getConfig } from '../../services/config';
import './style.scss';

const AuthPage = ({ children }) => {
  const { version, motd } = getConfig();

  return (
    <div className="l-auth-page">
      <header className="l-auth-page__header">
        <Brand className="l-auth-page__brand" />
      </header>
      <section className="l-auth-page__form">{children}</section>
      <footer className="l-auth-page__footer">
        <div>Current version: {version}</div>
        {motd && (
          <div>{motd}</div>
        )}
        <div>Be good</div>
      </footer>
    </div>
  );
};

AuthPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthPage;
