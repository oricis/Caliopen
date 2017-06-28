import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { v1 as uuidV1 } from 'uuid';
import Checkbox from './components/Checkbox';
import Switch from './components/Switch';
import { FieldErrors } from '..';

import './style.scss';

const CheckboxFieldGroup = ({
  id, className, label, showTextLabel, displaySwitch, errors, ...inputProps
}) => {
  const checkboxId = id || uuidV1();

  const renderCheckbox = () => (
    <Checkbox id={checkboxId} label={label} {...inputProps} />
  );


  const renderSwitch = () => (
    <div>
      <Switch id={checkboxId} label={label} {...inputProps} />
      {showTextLabel &&
        <label htmlFor={checkboxId} className="m-switch-field-group__label">{label}</label>
      }
    </div>
  );

  return (
    <div>
      <div className={classnames('m-switch-field-group', className)}>
        {displaySwitch ? renderSwitch() : renderCheckbox()}
        { errors.length > 0 && (
          <FieldErrors className="m-text-field-group__errors" errors={errors} />
        )}
      </div>
    </div>
  );
};

CheckboxFieldGroup.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  showTextLabel: PropTypes.bool,
  displaySwitch: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
};

CheckboxFieldGroup.defaultProps = {
  id: undefined,
  className: null,
  showTextLabel: false,
  displaySwitch: false,
  errors: [],
};

export default CheckboxFieldGroup;
