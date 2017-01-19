import React, { PropTypes } from 'react';
import './style.scss';

const Switch = ({ label, id, ...inputProps }) => (
  <div className="m-switch">
    <input
      type="checkbox"
      className="m-switch__input"
      id={id}
      {...inputProps}
    />
    <label className="m-switch__paddle" htmlFor={id}>
      <span className="show-for-sr">{label}</span>
    </label>
  </div>
);

Switch.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Switch;
