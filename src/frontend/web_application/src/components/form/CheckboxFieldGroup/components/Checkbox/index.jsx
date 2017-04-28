import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const Checkbox = ({ label, id, ...inputProps }) => (
  <div className="m-checkbox">
    <input
      type="checkbox"
      className="m-checkbox__input"
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
