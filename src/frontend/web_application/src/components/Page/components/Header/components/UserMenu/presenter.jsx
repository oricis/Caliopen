import React, { Component, PropTypes } from 'react';
import Link from '../../../../../Link';
import Icon from '../../../../../Icon';
import VerticalMenu, { VerticalMenuTextItem, VerticalMenuItem, Separator } from '../../../../../VerticalMenu';
import Dropdown, { DropdownController } from '../../../../../Dropdown';

class Presenter extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
    };
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
  }

  handleDropdownToggle = () => {
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  renderDropdown() {
    const { user, __ } = this.props;

    return (
      <div>
        <DropdownController
          toggle="co-user-menu"
          className="float-right"
          expanded
        >
          <Icon type="user" />&nbsp;
          <span className="show-for-small-only">{user && user.name}</span>&nbsp;
          <Icon type={this.state.isDropdownOpen ? 'caret-up' : 'caret-down'} />
        </DropdownController>
        <Dropdown
          id="co-user-menu"
          position="bottom"
          closeOnClick
          onToggle={this.handleDropdownToggle}
        >
          <VerticalMenu>
            <VerticalMenuTextItem>
              <div>{user.name}</div>
              {user && user.contact && (
                <div>{user.contact.emails[0] && user.contact.emails[0].address}</div>
              )}
            </VerticalMenuTextItem>
            <Separator />
            <VerticalMenuItem>
              <Link to="/account" expanded button>{__('header.menu.account')}</Link>
            </VerticalMenuItem>
            <VerticalMenuItem>
              {user && (
                <Link href="/auth/signout" button expanded>{__('header.menu.signout')}</Link>
              )}
              {!user && (
                <Link href="/auth/signin" button expanded>{__('header.menu.signin')}</Link>
              )}
            </VerticalMenuItem>
          </VerticalMenu>
        </Dropdown>
      </div>
    );
  }

  render() {
    if (this.props.user) {
      return this.renderDropdown();
    }

    return null;
  }
}

export default Presenter;
