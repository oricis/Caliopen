import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

export const FormColumn = ({ className, size, fluid = false, ...props }) => {
  const colClassName = classnames('m-form-grid__column', {
    'm-form-grid__column--fluid': fluid,
    'm-form-grid__column--shrink': size === 'shrink',
    'm-form-grid__column--small': size === 'small',
    'm-form-grid__column--medium': size === 'medium',
    'm-form-grid__column--large': size === 'large',
  }, className);

  return (
    <div className={colClassName} {...props} />
  );
};

FormColumn.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['shrink', 'small', 'medium', 'large']),
  fluid: PropTypes.bool,
};

export const FormRow = ({ className, ...props }) => (
  <div className={classnames('m-form-grid__row', className)} {...props} />
);

FormRow.propTypes = {
  className: PropTypes.string,
};

const Form = ({ className, ...props }) => (
  <form className={classnames('m-form-grid', className)} {...props} />
);

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
