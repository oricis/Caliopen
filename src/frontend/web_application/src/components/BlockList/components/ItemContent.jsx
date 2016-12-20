import React, { PropTypes } from 'react';
import classnames from 'classnames';

const ItemContent = ({ isLink, ...props }) => (
  <div
    className={classnames('m-block-list__item-content', { 'm-block-list__item-content--link': isLink })}
    {...props}
  />
);

ItemContent.propTypes = {
  isLink: PropTypes.bool,
};

export default ItemContent;
