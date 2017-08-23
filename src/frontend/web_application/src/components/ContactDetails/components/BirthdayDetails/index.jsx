import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';

class BirthdayDetails extends Component {
  static propTypes = {
    birthday: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    editMode: false,
  };

  renderDeleteButton() {
    const { __ } = this.props;

    return (
      <Button onClick={str => str} color="alert" icon="remove">
        <span className="show-for-sr">{__('contact.action.delete_contact_detail')}</span>
      </Button>
    );
  }

  render() {
    const {
      birthday,
      editMode,
    } = this.props;

    return (
      <span className="m-birthday-details">
        <Icon rightSpaced type="birthday-cake" />
        {birthday}
        {editMode && this.renderDeleteButton()}
      </span>
    );
  }
}

export default BirthdayDetails;
