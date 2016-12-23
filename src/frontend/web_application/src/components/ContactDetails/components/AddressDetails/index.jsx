import React, { Component, PropTypes } from 'react';
import Icon from '../../../Icon';
import Button from '../../../Button';
import './style.scss';

class AddressDetails extends Component {
  static propTypes = {
    address: PropTypes.shape({}),
    editMode: PropTypes.bool,
    onDelete: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.addressTypesTranslations = {
      work: __('contact.address_type.work'),
      home: __('contact.address_type.home'),
      other: __('contact.address_type.other'),
    };
  }

  handleDelete() {
    const { onDelete, address } = this.props;
    onDelete({ address });
  }

  renderDeleteButton() {
    const { __ } = this.props;

    return (
      <Button onClick={this.handleDelete} alert>
        <Icon type="remove" />
        <span className="show-for-sr">{__('contact.action.delete_contact_detail')}</span>
      </Button>
    );
  }

  render() {
    const {
      address,
      editMode,
    } = this.props;

    return (
      <span className="m-address-details">
        <Icon className="m-address-details__icon" type="map-marker" />
        <address className="m-address-details__postal-address">
          {address.street}, {address.postal_code} {address.city}
          {address.country} {address.region}
        </address>
        {' '}
        <small>
          <em>({address.label} {this.addressTypesTranslations[address.type]})</em>
        </small>
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default AddressDetails;
