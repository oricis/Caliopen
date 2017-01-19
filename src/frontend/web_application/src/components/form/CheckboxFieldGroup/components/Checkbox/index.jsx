import React, { PropTypes } from 'react';
import './style.scss';

const Checkbox = ({ label, id, ...inputProps }) => (
  <div className="m-checkbox">
    <input
      type="checkbox"
      id={id}
      {...inputProps}
    />
    <label className="m-checkbox__label" htmlFor={id}>{label}</label>
  </div>
);

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,

};

export default Checkbox;
