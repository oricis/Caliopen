import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

class PlaceholderBlock extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    shape: PropTypes.oneOf(['round', 'line', 'rect', 'square', 'avatar']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    display: PropTypes.oneOf(['inline-block', 'block']),
  };
  static defaultProps = {
    children: ' ',
    className: undefined,
    shape: 'rect',
    size: 'default',
    display: 'block',
  };

  render() {
    const {
      className, shape, ...props
    } = this.props;
    const modifiers = {
      // 'm-placeholder-block--round': shape === 'round',
      'm-placeholder-block--line': shape === 'line',
      // 'm-placeholder-block--square': shape === 'square',
      'm-placeholder-block--rect': shape === 'rect',
      'm-placeholder-block--avatar': shape === 'avatar',
      // 'm-placeholder-block--small': size === 'small',
      // 'm-placeholder-block--large': size === 'large',
      // 'm-placeholder-block--inline-block': display === 'inline-block',
    };

    return (
      <div className={classnames(className, 'm-placeholder-block', modifiers)} {...props} />
    );
  }
}

export default PlaceholderBlock;
