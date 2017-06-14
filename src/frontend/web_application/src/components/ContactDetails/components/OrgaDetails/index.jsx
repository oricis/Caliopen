import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { ItemContent } from '../../../TextList';

import './style.scss';

class OrgaDetails extends Component {
  static propTypes = {
    organization: PropTypes.shape({}).isRequired,
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
    const { onDelete, organization } = this.props;
    onDelete({ organization });
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
    const { organization, editMode } = this.props;

    return (
      <ItemContent large key={organization.organization_id}>
        <Icon type="briefcase" className="m-orga-details__icon" />
        {organization.job_description}
        {organization.job_description && organization.name && ' at '}{organization.name}
        {organization.department && ` (${organization.department})`}
        { ' ' }
        {editMode && this.renderDeleteButton()}
      </ItemContent>
    );
  }
}

export default OrgaDetails;
