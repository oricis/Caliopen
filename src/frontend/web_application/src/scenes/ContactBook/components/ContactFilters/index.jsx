import React, { PropTypes } from 'react';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup } from '../../../../components/form';

import './style.scss';

const ContactFilters = ({ onSortDirChange, onSortViewChange, sortDir, sortView }) => (
  <FormGrid className="m-contact-filters">
    <FormRow>
      <FormColumn size="shrink">
        <SelectFieldGroup
          name="format-view"
          className="m-contact-filters__col"
          label="Name format view"
          value={sortView}
          options={[{ value: 'given_name', label: 'Firstname, Name' }, { value: 'family_name', label: 'Name, Firstname' }]}
          onChange={onSortViewChange}
        />
      </FormColumn>
      <FormColumn size="shrink">
        <SelectFieldGroup
          className="m-contact-filters__col"
          name="order-by"
          label="Order by"
          value={sortDir}
          options={[{ value: 'ASC', label: 'A -> Z' }, { value: 'DESC', label: 'Z -> A' }]}
          onChange={onSortDirChange}
        />
      </FormColumn>
    </FormRow>
  </FormGrid>
);

ContactFilters.propTypes = {
  onSortDirChange: PropTypes.func,
  onSortViewChange: PropTypes.func,
  sortDir: PropTypes.string,
  sortView: PropTypes.string,
};

export default ContactFilters;
