import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import './style.scss';

class AddressDetails extends Component {
  static propTypes = {
    address: PropTypes.shape({}).isRequired,
    editMode: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    editMode: false,
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
    onDelete({ contactDetail: address });
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
      address,
      editMode,
    } = this.props;

    return (
      <span className="m-address-details">
        <Icon className="m-address-details__icon" type="map-marker" />
        <address className="m-address-details__postal-address">
          {address.street}{address.street && ', '}
          {address.postal_code}{address.postal_code && ' '}
          {address.city}{address.city && ' '}
          {address.country}{address.country && ' '}
          {address.region}
        </address>
        {' '}
        {(address.label || address.type) &&
          <small>
            <em>({address.label}{address.label && ' '}{this.addressTypesTranslations[address.type]})</em>
          </small>
        }
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default AddressDetails;
