import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import { SelectFieldGroup, FormGrid, FormRow, FormColumn } from '../../../../components/';

import './style.scss';

const ContactFilters = ({ onSortDirChange, sortDir, i18n }) => (
  <FormGrid>
    <FormRow className="m-contacts-filters">
      <FormColumn size="shrink">
        <div className="m-contacts-filters__item">
          <label htmlFor="order-by" className="m-contacts-filters__label">
            <Trans id="contacts-filters.order-by.label">Order by</Trans>
          </label>
          <SelectFieldGroup
            className="m-contacts-filters__select"
            name="order-by"
            label={i18n._('contacts-filters.order-by.label', { defaults: 'Order by' })}
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
  i18n: PropTypes.shape({}).isRequired,
  sortDir: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
};

export default withI18n()(ContactFilters);
