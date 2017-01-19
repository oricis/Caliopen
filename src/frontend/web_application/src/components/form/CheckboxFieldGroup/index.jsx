import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import Checkbox from './components/Checkbox';
import Switch from './components/Switch';

import './style.scss';

const CheckboxFieldGroup = ({ label, showTextLabel, displaySwitch, ...inputProps }) => {
  const id = uuidV1();

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
      </div>
    </div>
  );
};

CheckboxFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  showTextLabel: PropTypes.bool,
  displaySwitch: PropTypes.bool,
};

export default CheckboxFieldGroup;
