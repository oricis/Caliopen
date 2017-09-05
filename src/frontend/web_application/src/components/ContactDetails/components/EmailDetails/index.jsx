import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';

class EmailDetails extends Component {
  static propTypes = {
    email: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.emailTypesTranslations = {
      work: __('contact.email_type.work'),
      home: __('contact.email_type.home'),
      other: __('contact.email_type.other'),
    };
  }

  render() {
    const { email, __ } = this.props;

    const address = !email.is_primary ?
      email.address :
      (<strong title={__('contact.primary')}>{email.address}</strong>);

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
