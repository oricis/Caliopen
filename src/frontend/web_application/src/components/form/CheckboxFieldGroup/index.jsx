import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import Checkbox from './components/Checkbox';
import Switch from './components/Switch';
import { FieldErrors } from '..';

import './style.scss';

const CheckboxFieldGroup = ({
  id = uuidV1(), label, showTextLabel, displaySwitch, errors = [], ...inputProps
}) => {
  const renderCheckbox = () => (
    <Checkbox id={id} label={label} {...inputProps} />
  );


  const renderSwitch = () => (
    <div>
      <Switch id={id} label={label} {...inputProps} />
      {showTextLabel &&
        <label htmlFor={id} className="m-switch-field-group__label">{label}</label>
      }
    </div>
  );

  return (
    <div>
      <div className="m-switch-field-group">
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
  label: PropTypes.string.isRequired,
  showTextLabel: PropTypes.bool,
  displaySwitch: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default CheckboxFieldGroup;
