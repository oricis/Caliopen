import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { ItemContent } from '../../../TextList';

import './style.scss';

class IdentityDetails extends Component {
  static propTypes = {
    identity: PropTypes.shape({}).isRequired,
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
    const { onDelete, identity } = this.props;
    onDelete({ identity });
  }

  renderDeleteButton() {
    const { __ } = this.props;

    return (
      <Button onClick={this.handleDelete()} color="alert" icon="remove">
        <span className="show-for-sr">{__('contact.action.delete_contact_detail')}</span>
      </Button>
    );
  }

  render() {
    const { identity, editMode } = this.props;

    return (
      <ItemContent large>
        <Icon type={identity.type} className="m-identity-details__icon" />
        {identity.value}
        {editMode && this.renderDeleteButton()}
      </ItemContent>
    );
  }
}

export default IdentityDetails;
