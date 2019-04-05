import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

class Fielset extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: undefined,
  };

  render() {
    const { className, ...props } = this.props;

    return (
      <fieldset className={classnames('m-fieldset', className)} {...props} />
    );
  }
}

export { default as Legend } from './components/Legend';
export default Fielset;
