import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

const renderComponent = (C, className) => {
  const { className: originalClassName, ...props } = C.props;
  const componentProps = {
    ...props,
    className: classnames(className, originalClassName),
  };

  return (<C.type {...componentProps} />);
};

const NavbarItem = ({
  className, active, last, contentChildren, actionChildren, children, ...props
}) => {
  const navbarItemProps = {
    ...props,
    className: classnames('m-navbar-item', className, {
      'm-navbar-item--is-active': active,
      'm-navbar-item--last': last,
    }),
  };

  return (
    <div {...navbarItemProps}>
      {contentChildren && renderComponent(contentChildren, 'm-navbar-item__content')}
      {actionChildren && renderComponent(actionChildren, 'm-navbar-item__action')}
      {children}
    </div>
  );
};

NavbarItem.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  last: PropTypes.bool,
  contentChildren: PropTypes.node,
  actionChildren: PropTypes.node,
  children: PropTypes.node,
};

NavbarItem.defaultProps = {
  className: undefined,
  active: false,
  last: false,
  contentChildren: null,
  actionChildren: null,
  children: null,
};

export default NavbarItem;
