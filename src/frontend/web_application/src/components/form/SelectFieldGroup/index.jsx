import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import FieldErrors from '../FieldErrors';
import './style.scss';

const SelectFieldGroup = ({
  label, showLabelforSr, expanded = true, options, errors = [], onChange, className, ...props
}) => {
  const id = uuidV1();
  const selectClassName = classnames(
    'm-select-field-group__select',
    {
      'm-select-field-group--expanded__select': expanded,
    }
  );
  const labelClassName = classnames('m-select-field-group__label', {
    'show-for-sr': showLabelforSr,
  });

  return (
    <div className={classnames('m-select-field-group', className)}>
      <label htmlFor={id} className={labelClassName}>{label}</label>
      <select
        onChange={onChange}
        className={selectClassName}
        id={id}
        {...props}
      >
        {options.map(selectOption => (
          <option key={selectOption.label} value={selectOption.value}>{}</option>
        ))}
      </select>
      { errors.length !== 0 && (
        <div className="m-select-field-group__errors">
          <FieldErrors errors={errors} />
        </div>
      )}
    </div>
  );
};

const propTypeOption = PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]);

const alphaNumPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

SelectFieldGroup.propTypes = {
  label: PropTypes.string,
  showLabelforSr: PropTypes.bool,
  value: alphaNumPropType,
  expanded: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ label: propTypeOption, value: propTypeOption })),
  errors: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default SelectFieldGroup;
