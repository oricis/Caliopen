import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import NavList, { ItemContent } from '../../components/NavList';
import Link from '../../components/Link';
import './style.scss';

class MenuBar extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    navLinks: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      title: PropTypes.string,
      isActive: PropTypes.bool,
      to: PropTypes.string.isRequired,
    })),
  };

  static defaultProps = {
    className: null,
    children: null,
    navLinks: null,
  };

  render() {
    const { className, navLinks, children } = this.props;
    const menuBarClassName = classnames(
      'm-menu-bar',
      className,
    );

    return (
      <div className={menuBarClassName}>
        {navLinks &&
          <NavList>
            {navLinks.map(link => (
              <ItemContent active={link.isActive} large key={link.key}>
                <Link noDecoration title={link.title} to={link.to}>{link.label}</Link>
              </ItemContent>
            ))}
          </NavList>
        }
        { !navLinks && children }
      </div>
    );
  }
}

export default MenuBar;
