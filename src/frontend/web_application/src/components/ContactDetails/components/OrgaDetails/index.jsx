import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';

class OrgaDetails extends Component {
  static propTypes = {
    organization: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
  };

  renderJobTitle() {
    const { organization, __ } = this.props;
    const department = organization.department ? ` (${organization.department})` : '';
    let organizationDescription = `${(organization.job_description || organization.name)} ${department}`;

    if (organization.job_description && organization.name) {
      organizationDescription = __('orga-details.job.desc-full', {
        jobDesc: organization.job_description,
        orgaName: organization.name,
        department,
      });
    }

    return <span title={organization.label}>{organizationDescription}</span>;
  }

  render() {
    return (
      <span className="m-orga-details">
        <Icon type="briefcase" rightSpaced />
        {this.renderJobTitle()}
        { ' ' }
      </span>
    );
  }
}

export default OrgaDetails;
