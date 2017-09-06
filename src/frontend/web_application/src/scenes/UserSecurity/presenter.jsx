import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OpenPGPKeysDetails from './components/OpenPGPKeysDetails';
import TFAForm from './components/TFAForm';
import PasswordDetails from './components/PasswordDetails';
import LoginDetails from './components/LoginDetails';
import Section from '../../components/Section';
import './style.scss';

class UserSecurity extends Component {
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
    const fakeUser = {
      username: 'Dev',
      privacy_features: {
        password_strength: 2,
      },
      password: '123456',
    };

    return (
      <div className="s-user-account-security">
        {
          // FIXME: according to UX, there should be a sub-menu in right column
          // to switch between each <Section />
        }
        <Section title={__('user.security.section_password.title')}>
          <div className="s-user-account-security__credentials">
            <div className="s-user-account-security__login">
              <LoginDetails user={fakeUser} __={__} />
            </div>
            <div className="s-user-account-security__password">
              <PasswordDetails user={fakeUser} __={__} />
            </div>
          </div>
        </Section>
        <Section title={__('user.security.section_tfa.title')}>
          <TFAForm user={user} />
        </Section>
        <Section title={__('user.security.section_pgpkeys.title')}>
          <OpenPGPKeysDetails user={user} />
        </Section>
      </div>
    );
  }
}

export default UserSecurity;
