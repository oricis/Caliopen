import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountOpenPGPKeys from './components/AccountOpenPGPKeys';
import TFAForm from './components/TFAForm';
import PasswordForm from './components/PasswordForm';
import Section from '../../components/Section';


class AccountSecurity extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestUser: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
  };
  static defaultProps = {
    user: undefined,
  };

  componentDidMount() {
    this.props.requestUser();
  }

  render() {
    const { __, user } = this.props;

    return (
      <div className="s-account-security">
        <Section title={__('account.security.section_password.title')}>
          <PasswordForm user={user} />
        </Section>
        <Section title={__('account.security.section_tfa.title')}>
          <TFAForm user={user} />
        </Section>
        <Section title={__('account.security.section_pgpkeys.title')}>
          <AccountOpenPGPKeys user={user} />
        </Section>
      </div>
    );
  }
}

export default AccountSecurity;
