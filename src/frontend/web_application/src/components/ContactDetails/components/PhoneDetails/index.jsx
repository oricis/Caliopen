import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';

class PhoneDetails extends Component {
  static propTypes = {
    phone: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.typeTranslations = {
      work: __('contact.phone_type.work'),
      home: __('contact.phone_type.home'),
      other: __('contact.phone_type.other'),
    };
  }

  render() {
    const { phone } = this.props;

    return (
      <span className="m-phone-details">
        <Icon rightSpaced type="phone" />
        {phone.number}
        {' '}
        {phone.type && <small><em>{this.typeTranslations[phone.type]}</em></small>}
      </span>
    );
  }
}

export default PhoneDetails;
