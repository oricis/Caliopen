import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ItemContent = ({ className, active, large, ...props }) => {
  const itemClassName = classnames(
    'm-nav-list__item',
    {
      'm-nav-list__item--large': large,
      'm-nav-list__item--active': active,
    },
    className
  );

  return (
    <li className={itemClassName} {...props} />
  );
};

ItemContent.propTypes = {
  active: PropTypes.bool,
  large: PropTypes.bool,
  className: PropTypes.string,
};

export default ItemContent;
