import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import './style.scss';

class ImDetails extends Component {
  static propTypes = {
    im: PropTypes.shape({}),
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
    this.imTypesTranslations = {
      work: __('contact.im_type.work'),
      home: __('contact.im_type.home'),
      other: __('contact.im_type.other'),
    };
  }

  handleDelete() {
    const { onDelete, im } = this.props;
    onDelete({ im });
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
      im,
      editMode,
    } = this.props;

    return (
      <span className="m-im-details">
        <Icon className="m-im-details__icon" type="comment" />
        {im.address}
        {' '}
        <small><em>{this.imTypesTranslations[im.type]}</em></small>
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default ImDetails;
