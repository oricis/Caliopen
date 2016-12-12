import React, { PropTypes } from 'react';
import { Link as BaseLink } from 'react-router';
import classnames from 'classnames';
import './style.scss';

const Link = ({ raw, className, modifiers = {}, active = false, ...props }) => {
  const linkProps = {
    ...props,
    className: classnames(
      className,
      'm-link',
      {
        'm-link--button': modifiers.button,
        'm-link--expanded': modifiers.expanded,
        'm-link--text': !modifiers.button && !raw,
        'm-link--active': active,
      }
    ),
  };

  return <BaseLink {...linkProps} />;
};

Link.propTypes = {
  raw: PropTypes.bool,
  className: PropTypes.string,
  modifiers: PropTypes.shape({ button: PropTypes.bool, expanded: PropTypes.bool }),
  active: PropTypes.bool,
};

export default Link;
