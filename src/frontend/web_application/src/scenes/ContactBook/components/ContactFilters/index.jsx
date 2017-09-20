import React from 'react';
import PropTypes from 'prop-types';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup } from '../../../../components/form';

import './style.scss';

const ContactFilters = ({ onSortDirChange, sortDir, __ }) => (
  <FormGrid>
    <FormRow className="m-contacts-filters">
      <FormColumn size="shrink">
        <div className="m-contacts-filters__item">
          <label htmlFor="order-by" className="m-contacts-filters__label">
            {__('contacts-filters.order-by.label')}
          </label>
          <SelectFieldGroup
            className="m-contacts-filters__select"
            name="order-by"
            label={__('contacts-filters.order-by.label')}
            value={sortDir}
            options={[{ value: 'ASC', label: 'A -> Z' }, { value: 'DESC', label: 'Z -> A' }]}
            onChange={onSortDirChange}
            showLabelforSr
            expanded
          />
        </div>
      </FormColumn>
    </FormRow>
  </FormGrid>
);

ContactFilters.propTypes = {
  onSortDirChange: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
  sortDir: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
};

export default ContactFilters;
