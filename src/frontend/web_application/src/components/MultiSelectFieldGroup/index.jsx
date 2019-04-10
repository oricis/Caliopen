import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import FieldGroup from '../FieldGroup';

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

  render() {
    const {
      className, errors, onChange, options, ...props
    } = this.props;
    const id = `msfg-${uuidV1()}`;

    return (
      <FieldGroup className={classnames('m-select-field-group', className)} errors={errors}>
        <select
          id={id}
          className="m-multi-select-field-group__select"
          name="multiple"
          {...props}
        >
          {options}
        </select>
      </FieldGroup>
    );
  }
}

export default MultiSelectFieldGroup;
