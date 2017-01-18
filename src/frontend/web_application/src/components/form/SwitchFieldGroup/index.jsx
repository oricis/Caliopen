import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import { Switch, Checkbox } from '..';
import TextBlock from '../../TextBlock';

import './style.scss';

const SwitchFieldGroup = ({ label, showTextLabel, ...inputProps }) => {
  const id = uuidV1();

  return (
    <div>
      <div className="m-switch-field-group">
        <Switch id={id} label={label} {...inputProps} />
        { showTextLabel &&
          <label htmlFor={id} className="m-switch-field-group__label">
            <TextBlock inline>{label}</TextBlock>
          </label>
        }
      </div>
      <div className="m-switch-field-group">
        <Checkbox id="{id}" label={label} {...inputProps} />
      </div>
    </div>
  );
};

SwitchFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  showTextLabel: PropTypes.bool,
};

export default SwitchFieldGroup;
