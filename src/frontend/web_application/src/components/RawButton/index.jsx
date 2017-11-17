import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class RawButton extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['button', 'submit']),
    children: PropTypes.node.isRequired,
  };
  static defaultProps = {
    type: 'button',
  };

  render() {
    const { children, type, ...props } = this.props;
    const buttonProps = {
      ...props,
      type,
    };

    return (
      <button {...buttonProps}>{children}</button>
    );
  }
}

export default RawButton;
