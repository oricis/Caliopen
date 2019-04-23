import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

class FieldErrors extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
  };

  static defaultProps = {
    errors: [],
    className: undefined,
  };

  render() {
    const { errors, className } = this.props;

    if (errors.length === 0) {
      return null;
    }

    return (
      <ul className={classnames('m-field-errors', className)}>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    );
  }
}

export default FieldErrors;
