import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FieldGroup from '../FieldGroup';
import CheckboxFieldGroup from '../CheckboxFieldGroup';

const propTypeOption = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
const alphaNumPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class MultiSelectFieldGroup extends PureComponent {
  static propTypes = {
    label: PropTypes.node,
    value: PropTypes.arrayOf(alphaNumPropType),
    options: PropTypes.arrayOf(PropTypes.shape({ label: propTypeOption, value: propTypeOption })),
    errors: PropTypes.arrayOf(PropTypes.node),
    onChange: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    label: null,
    options: [],
    value: [],
    errors: [],
    onChange: () => {},
    className: null,
  };

  makeChangeHandler = option => () => {
    const { onChange } = this.props;

    onChange(option);
  }

  render() {
    const {
      className, errors, options,
    } = this.props;

    return (
      <FieldGroup className={classnames('m-select-field-group', className)} errors={errors}>
        {options.map(option => (
          <CheckboxFieldGroup
            label={option.label}
            onChange={this.makeChangeHandler(option.label)}
            checked={this.props.value.includes(option.value)}
          />
        ))}
      </FieldGroup>
    );
  }
}

export default MultiSelectFieldGroup;
