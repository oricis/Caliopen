import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import { Icon } from '../../../../components';

@withI18n()
class EmailDetails extends Component {
  static propTypes = {
    email: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  initTranslations() {
    const { i18n } = this.props;
    this.emailTypesTranslations = {
      work: i18n._('contact.email_type.work', { defaults: 'Professional' }),
      home: i18n._('contact.email_type.home', { defaults: 'Personal' }),
      other: i18n._('contact.email_type.other', { defaults: 'Other' }),
    };
  }

  render() {
    const { email, i18n } = this.props;

    const address = !email.is_primary ?
      email.address :
      (<strong title={i18n._('contact.primary', { defaults: 'Primary' })}>{email.address}</strong>);

    return (
      <span className="m-email-details">
        <Icon rightSpaced type="envelope" />
        {address}
        {' '}
        <small><em>{this.emailTypesTranslations[email.type]}</em></small>
      </span>
    );
  }
}

export default EmailDetails;
