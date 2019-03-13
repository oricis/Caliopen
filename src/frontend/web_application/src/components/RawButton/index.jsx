import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';

class RawButton extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['button', 'submit']),
    children: PropTypes.node.isRequired,
    innerRef: PropTypes.shape({ current: PropTypes.shape({}) }),
  };
  static defaultProps = {
    type: 'button',
    innerRef: undefined,
  };

  render() {
    const {
      children, type, innerRef, ...props
    } = this.props;
    const buttonProps = {
      ...props,
      type,
    };

    return (
      <button {...buttonProps} ref={innerRef}>{children}</button>
    );
  }
}

export default forwardRef((props, ref) => (<RawButton {...props} innerRef={ref} />));
