import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from '../../../../../../../../components/';
import './style.scss';

const ItemLink = ({ className, ...props }) => {
  const linkProps = {
    ...props,
    className: classnames('m-item-link', className),
  };

  return (
    <Link noDecoration {...linkProps} />
  );
};

ItemLink.propTypes = {
  className: PropTypes.string,
};

ItemLink.defaultProps = {
  className: null,
};

export default ItemLink;
