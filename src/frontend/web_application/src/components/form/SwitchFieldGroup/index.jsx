import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import { Switch, Checkbox } from '..';
import TextBlock from '../../TextBlock';

import './style.scss';


const DisplayCheckbox = ({ id, label, ...inputProps }) => (
  <Checkbox id={id} label={label} {...inputProps} />
);

DisplayCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.number,
};

const DisplaySwitch = ({ id, label, showTextLabel, ...inputProps }) => {
  return (
    <div>
      <Switch id={id} label={label} {...inputProps} />
      {showTextLabel &&
        <label htmlFor={id} className="m-switch-field-group__label">
          <TextBlock inline size="small">{label}</TextBlock>
        </label>
      }
    </div>
  );
};


DisplaySwitch.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.number,
  showTextLabel: PropTypes.bool,
};

const SwitchFieldGroup = ({ label, showTextLabel, display, ...inputProps }) => {
  const id = uuidV1();

  return (
    <div>
      <div className="m-switch-field-group">
        {display === 'switch' ?
          <DisplaySwitch id={id} label={label} showTextLabel={showTextLabel} {...inputProps} />
          :
          <DisplayCheckbox id={id} label={label} {...inputProps} />
        }

      </div>
    </div>
  );
};

SwitchFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  showTextLabel: PropTypes.bool,
  display: PropTypes.oneOf.switch,
};

export default SwitchFieldGroup;
