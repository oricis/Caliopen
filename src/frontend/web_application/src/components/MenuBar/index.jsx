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
    navLinks: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    className: null,
    children: null,
    navLinks: null,
  };

  state = {
    activeLink: {},
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
              // FIXME: active prop not working
              <ItemContent
                active={this.state.activeLink === link && true}
                large
                key={link.title}
              >
                <Link
                  noDecoration
                  // onClick={this.handleClickLink}
                  {...link}
                >{link.title}</Link>
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
