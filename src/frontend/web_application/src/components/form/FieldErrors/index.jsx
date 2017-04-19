import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

const FieldErrors = ({ errors = [], className }) => (
  <ul className={classnames('m-field-errors', className)}>
    { errors.map(error => (
      <li key={error}>{error}</li>
    ))}
  </ul>
);

FieldErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default FieldErrors;
