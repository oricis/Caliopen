import React from 'react';
import PropTypes from 'prop-types';
import { Link as BaseLink } from 'react-router-dom';
import classnames from 'classnames';
import './style.scss';

const Link = ({ children, href, noDecoration, className, button, expanded, active, ...props }) => {
  const linkProps = {
    ...props,
    className: classnames(
      className,
      'm-link',
      {
        'm-link--button': button,
        'm-link--expanded': expanded,
        'm-link--text': !button && !noDecoration,
        'm-link--active': active,
      }
    ),
  };

  if (href) {
    return <a href={href} {...linkProps}>{children}</a>;
  }

  return <BaseLink {...linkProps}>{children}</BaseLink>;
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  noDecoration: PropTypes.bool,
  className: PropTypes.string,
  button: PropTypes.bool,
  expanded: PropTypes.bool,
  active: PropTypes.bool,
};

Link.defaultProps = {
  href: undefined,
  noDecoration: false,
  className: undefined,
  button: false,
  expanded: false,
  active: false,
};

export default Link;
