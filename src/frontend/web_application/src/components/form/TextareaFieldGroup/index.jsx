import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import FieldErrors from '../FieldErrors';
import './style.scss';

const TextareaFieldGroup = ({
  label, expanded = true, errors = [], onChange, className, ...props
}) => {
  const id = uuidV1();
  const textareaClassName = classnames(
    'm-textarea-field-group__textarea',
    {
      'm-textarea-field-group--expanded__textarea': expanded,
    }
  );

  return (
    <div className={classnames('m-textarea-field-group', className)}>
      <label htmlFor={id} className="m-textarea-field-group__label">{label}</label>
      <textarea
        id={id}
        type="text"
        className={textareaClassName}
        onChange={onChange}
        {...props}
      />
      {errors.length !== 0 && (
        <FieldErrors lassName="m-textarea-field-group__errors" errors={errors} />
      )}
    </div>
  );
};

TextareaFieldGroup.propTypes = {
  label: PropTypes.string,
  expanded: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  className: PropTypes.string,
};


export default TextareaFieldGroup;
