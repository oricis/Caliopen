import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import { Switch, FieldErrors } from '..';

import './style.scss';

const SwitchFieldGroup = ({
  label,
  errors = [],
  className,
  showLabel = true,
  ...inputProps
}) => {
  const id = uuidV1();

  return (
    <div className={classnames('m-switch-field-group', className)}>
      <Switch {...inputProps} />
      { showLabel && <label htmlFor={id} className="m-switch-field-group__label">{label}</label>}
      { errors.length > 0 && (
        <FieldErrors className="m-switch-field-group__errors" errors={errors} />
      )}
    </div>
  );
};

SwitchFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default SwitchFieldGroup;
