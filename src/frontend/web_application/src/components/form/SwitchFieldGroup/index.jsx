import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import { Switch } from '..';
import TextBlock from '../../TextBlock';


import './style.scss';

const SwitchFieldGroup = ({ label, showTextLabel, ...inputProps }) => {
  const id = uuidV1();

  return (
    <div className="m-switch-field-group">
      <Switch id={id} label={label} {...inputProps} />
      { showTextLabel &&
        <label htmlFor={id} className="m-switch-field-group__label">
          <TextBlock inline size="small">{label}</TextBlock>
        </label>
      }
    </div>
  );
};

SwitchFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  showTextLabel: PropTypes.bool,
};

export default SwitchFieldGroup;
