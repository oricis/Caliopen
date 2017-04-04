import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Dropdown, { withDropdownControl } from '../Dropdown';
import './style.scss';

export { withDropdownControl };

const DropdownMenu = ({ className, ...props }) => (
  <Dropdown className={classnames('m-dropdown-menu', className)} {...props} />
);
DropdownMenu.propTypes = {
  className: PropTypes.string,
};

DropdownMenu.defaultProps = {
  className: null,
};

export default DropdownMenu;
