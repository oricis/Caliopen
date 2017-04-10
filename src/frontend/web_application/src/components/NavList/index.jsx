import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ItemContent from './components/ItemContent';
import './style.scss';

const NavList = ({ className, dir, ...props }) => {
  const navClassName = classnames(
    'm-nav-list',
    {
      'm-nav-list--vertical': dir === 'vertical',
    },
  );

  return (
    <nav className={classnames('m-nav', className)}>
      <ul className={navClassName} {...props} />
    </nav>
  );
};

NavList.propTypes = {
  className: PropTypes.string,
  dir: PropTypes.oneOf(['vertical']),
};

NavList.defaultProps = {
  className: null,
  dir: null,
};

export { ItemContent };

export default NavList;
