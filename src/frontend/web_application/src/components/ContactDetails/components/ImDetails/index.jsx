import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';

class ImDetails extends Component {
  static propTypes = {
    im: PropTypes.shape({}).isRequired,
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
    this.imTypesTranslations = {
      work: __('contact.im_type.work'),
      home: __('contact.im_type.home'),
      other: __('contact.im_type.other'),
    };
  }

  handleDelete() {
    const { onDelete, im } = this.props;
    onDelete({ contactDetail: im });
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
      im,
      editMode,
    } = this.props;

    return (
      <span className="m-im-details">
        <Icon rightSpaced type="comment" />
        {im.address}
        {' '}
        <small><em>{this.imTypesTranslations[im.type]}</em></small>
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default ImDetails;
