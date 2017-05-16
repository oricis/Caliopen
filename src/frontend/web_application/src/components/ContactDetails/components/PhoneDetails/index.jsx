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
  }

  handleDelete() {
    const { onDelete, phone } = this.props;
    onDelete({ phone });
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
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default PhoneDetails;
