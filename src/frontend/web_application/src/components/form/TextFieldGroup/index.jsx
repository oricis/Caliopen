import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import { InputText, FieldErrors } from '..';
import './style.scss';

const TextFieldGroup = ({
  label,
  errors = [],
  expanded = true,
  className,
  showLabelforSr = false,
  ...inputProps
}) => {
  const id = uuidV1();

  const hasError = errors.length > 0;

  const labelClassName = classnames('m-text-field-group__label', {
    'show-for-sr': showLabelforSr,
  });

  return (
    <div className={classnames('m-text-field-group', className)}>
      <label htmlFor={id} className={labelClassName}>{label}</label>
      <InputText
        id={id} expanded={expanded} hasError={hasError}
        {...inputProps}
      />
      { errors.length > 0 && (
        <FieldErrors className="m-text-field-group__errors" errors={errors} />
      )}
    </div>
  );
};

TextFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  showLabelforSr: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  expanded: PropTypes.bool,
  className: PropTypes.string,
};

export default TextFieldGroup;
