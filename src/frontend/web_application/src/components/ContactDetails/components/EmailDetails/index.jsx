import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';

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
      work: i18n.t`contact.email_type.work`,
      home: i18n.t`contact.email_type.home`,
      other: i18n.t`contact.email_type.other`,
    };
  }

  render() {
    const { email, i18n } = this.props;

    const address = !email.is_primary ?
      email.address :
      (<strong title={i18n.t`contact.primary`}>{email.address}</strong>);

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
