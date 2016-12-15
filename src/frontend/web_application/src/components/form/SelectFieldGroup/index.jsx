import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import FieldErrors from '../FieldErrors';
import './style.scss';

const SelectFieldGroup = ({
  label, expanded = true, bottomSpace = true, options, errors = [], onChange, className, ...props
}) => {
  const id = uuidV1();
  const selectClassName = classnames(
    'm-select-field-group__select',
    {
      'm-select-field-group__select--expanded': expanded,
      'm-select-field-group__select--bottom-space': bottomSpace,
    }
  );

  return (
    <div className={classnames('m-select-field-group', className)}>
      <label htmlFor={id} className="m-text-field-group__label">{label}</label>
      <select
        onChange={onChange}
        className={selectClassName}
        id={id}
        {...props}
      >
        {options.map((selectOption, key) => (
          <option key={key} value={selectOption.value}>{selectOption.label}</option>
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

SelectFieldGroup.propTypes = {
  label: PropTypes.string,
  expanded: PropTypes.bool,
  bottomSpace: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ label: propTypeOption, value: propTypeOption })),
  errors: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default SelectFieldGroup;
