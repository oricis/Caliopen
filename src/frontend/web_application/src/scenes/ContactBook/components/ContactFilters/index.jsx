import React, { PropTypes } from 'react';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup } from '../../../../components/form';

import './style.scss';

const ContactFilters = ({ onSortDirChange, onSortViewChange, sortDir, sortView, __ }) => (
  <FormGrid className="m-contact-filters">
    <FormRow>
      <FormColumn size="shrink">
        <SelectFieldGroup
          name="format-view"
          className="m-contacts-filters__select"
          label={__('contacts-filters.format-view.label')}
          value={sortView}
          options={[{ value: 'given_name', label: __('contacts-filters.format-view.firstname') }, { value: 'family_name', label: __('contacts-filters.format-view.name') }]}
          onChange={onSortViewChange}
        />
      </FormColumn>
      <FormColumn size="shrink">
        <SelectFieldGroup
          className="m-contacts-filters__select"
          name="order-by"
          label={__('contacts-filters.order-by.label')}
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
  __: PropTypes.func,
  sortDir: PropTypes.string,
  sortView: PropTypes.string,
};

export default ContactFilters;
