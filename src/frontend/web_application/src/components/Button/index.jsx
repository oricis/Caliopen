import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';
import RawButton from '../RawButton';
import './style.scss';

class Button extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    shape: PropTypes.oneOf(['plain', 'hollow']),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    display: PropTypes.oneOf(['inline', 'inline-block', 'block', 'expanded']),
    color: PropTypes.oneOf(['success', 'alert', 'secondary', 'active', 'disabled']),
    responsive: PropTypes.oneOf(['icon-only', 'text-only']),
    accessKey: PropTypes.string,
    noDecoration: PropTypes.bool,
    disabled: PropTypes.bool,
    innerRef: PropTypes.shape({}),
  };
  static defaultProps = {
    className: undefined,
    children: null,
    shape: null,
    icon: null,
    display: 'inline-block', // default style for button is --inline-block
    color: null,
    responsive: null,
    accessKey: null,
    noDecoration: false,
    disabled: false,
    innerRef: undefined,
  };

  renderIcon({ className }) {
    const { icon } = this.props;
    if (React.isValidElement(icon)) {
      const iconProps = {
        ...icon.props,
        className: classnames(icon.props.className, className),
      };

      return (<icon.type {...iconProps} />);
    }

    return (<Icon className={className} type={icon} />);
  }

  render() {
    const {
      children, className, icon, display, color, shape, responsive, noDecoration, innerRef, ...props
    } = this.props;

    const buttonProps = {
      ...props,
      className: classnames(
        className,
        'm-button',
        {
          'm-button--active': color === 'active',
          'm-button--alert': color === 'alert',
          'm-button--secondary': color === 'secondary',
          'm-button--success': color === 'success',
          'm-button--disabled': color === 'disabled',

          'm-button--expanded': display === 'expanded',
          'm-button--inline': display === 'inline',
          'm-button--text': display === 'inline' && !noDecoration,
          'm-button--inline-block': display === 'inline-block',
          'm-button--block': display === 'block',

          'm-button--plain': shape === 'plain',
          'm-button--hollow': shape === 'hollow',

          'm-button--icon': icon,

          'm-button--icon-only': responsive === 'icon-only',
          'm-button--text-only': responsive === 'text-only',
        }
      ),
    };

    if (icon) {
      return (
        <RawButton {...buttonProps} ref={innerRef}>
          {this.renderIcon({ icon, className: 'm-button__icon' })}
          {children && <span className="m-button__text">{children}</span>}
        </RawButton>
      );
    }

    return <RawButton onMouse {...buttonProps} ref={innerRef}>{children}</RawButton>;
  }
}

export default forwardRef((props, ref) => (<Button {...props} innerRef={ref} />));
