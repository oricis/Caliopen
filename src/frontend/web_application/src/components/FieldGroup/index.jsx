import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FieldErrors from '../FieldErrors';

import './style.scss';

class FieldGroup extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    className: null,
    errors: [],
  };

  state = {}

  render() {
    const { className, children, errors } = this.props;

    return (
      <div className={classnames('m-field-group', className)}>
        {children}
        {errors.length > 0 && (
          <FieldErrors className="m-field-group__errors" errors={errors} />
        )}
      </div>
    );
  }
}

export default FieldGroup;
