import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const Badge = ({ low, large, className, noRadius, ...props }) => (
  <span
    className={classnames('m-badge', { 'm-badge--low': low, 'm-badge--large': large, 'm-badge--no-radius': noRadius }, className)}
    {...props}
  />
);

Badge.propTypes = {
  low: PropTypes.bool,
  large: PropTypes.bool,
  noRadius: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
