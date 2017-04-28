import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import FieldErrors from '../FieldErrors';
import './style.scss';

const alphaNumPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class RadioFieldGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: alphaNumPropType,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({})),
    errors: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.renderOption = this.renderOption.bind(this);
  }

  renderOption(option, key) {
    const id = uuidV1();
    const { name, value, onChange } = this.props;

    return (
      <div key={key} className="m-radio-field-group__entry">
        <input
          id={id}
          type="radio"
          name={name}
          checked={value === option.value}
          value={option.value}
          onChange={onChange}
        />
        {' '}
        <label htmlFor={id}>{option.label}</label>
      </div>
    );
  }

  render() {
    const { options, errors = [], className } = this.props;

    return (
      <div className={classnames('m-radio-field-group', className)}>
        {options.map(this.renderOption)}
        { errors.length !== 0 && (
          <div className="m-radio-field-group__errors">
            <FieldErrors errors={errors} />
          </div>
        )}
      </div>
    );
  }
}

export default RadioFieldGroup;
