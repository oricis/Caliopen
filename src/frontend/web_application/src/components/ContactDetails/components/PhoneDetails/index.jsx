import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import './style.scss';

class PhoneDetails extends Component {
  static propTypes = {
    phone: PropTypes.shape({}).isRequired,
    editMode: PropTypes.bool,
    onDelete: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    editMode: false,
    onDelete: () => {},
  };

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
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

  handleDelete() {
    const { onDelete, phone } = this.props;
    onDelete({ contactDetail: phone });
  }

  renderDeleteButton() {
    const { __ } = this.props;

    return (
      <Button onClick={this.handleDelete} color="alert" icon="remove">
        <span className="show-for-sr">{__('contact.action.delete_contact_detail')}</span>
      </Button>
    );
  }

  render() {
    const {
      phone,
      editMode,
    } = this.props;

    return (
      <span className="m-phone-details">
        <Icon className="m-phone-details__icon" type="phone" />
        {phone.number}
        {' '}
        {phone.type && <small><em>{this.typeTranslations[phone.type]}</em></small>}
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default PhoneDetails;
