import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OpenPGPKeysDetails from './components/OpenPGPKeysDetails';
import TFAForm from './components/TFAForm';
import PasswordForm from './components/PasswordForm';
import Section from '../../components/Section';


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

    return (
      <div className="s-account-security">
        {
          // FIXME: according to UX, there should be a sub-menu in right column
          // to switch between each <Section />
        }
        <Section title={__('user.security.section_password.title')}>
          <PasswordForm user={user} />
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
