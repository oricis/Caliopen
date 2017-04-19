import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ItemContent = ({ className, large, ...props }) => {
  const itemClassName = classnames(
    'm-text-list__item',
    {
      'm-text-list__item--large': large,
    },
    className
  );

  return (
    <li className={itemClassName} {...props} />
  );
};

ItemContent.propTypes = {
  large: PropTypes.bool,
  className: PropTypes.string,
};

export default ItemContent;
