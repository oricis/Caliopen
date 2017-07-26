import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserInfo from '../../../UserInfo';
import Link from '../../../../../../components/Link';
import Button from '../../../../../../components/Button';
import Icon from '../../../../../../components/Icon';
import VerticalMenu, { VerticalMenuItem, Separator } from '../../../../../../components/VerticalMenu';
import DropdownMenu, { withDropdownControl } from '../../../../../../components/DropdownMenu';
import './style.scss';

const DropdownControl = withDropdownControl(Button);

class Presenter extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
  };

  state = {
    isDropdownOpen: false,
  };

  handleDropdownToggle = () => {
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  render() {
    const { user, __ } = this.props;

    return (
      <div className="m-user-menu">
        <DropdownControl
          toggle="co-user-menu"
          className="float-right"
          display="expanded"
          icon="user"
        >
          <span className="show-for-small-only">{user && user.name}</span>&nbsp;
          <Icon type={this.state.isDropdownOpen ? 'caret-up' : 'caret-down'} />
        </DropdownControl>
        <DropdownMenu
          id="co-user-menu"
          position="bottom"
          closeOnClick
          onToggle={this.handleDropdownToggle}
        >
          <VerticalMenu>
            <VerticalMenuItem>
              <UserInfo className="m-user-menu__user-info" />
            </VerticalMenuItem>
            <Separator />
            <VerticalMenuItem>
              <Link to="/account/profile" expanded button>{__('header.menu.account')}</Link>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <Link to="/settings/identities" expanded button>{__('header.menu.settings')}</Link>
            </VerticalMenuItem>
            <VerticalMenuItem>
              {user && (
                <Link href="/auth/signout" button expanded>{__('header.menu.signout')}</Link>
              )}
              {!user && (
                <Link to="/auth/signin" button expanded>{__('header.menu.signin')}</Link>
              )}
            </VerticalMenuItem>
          </VerticalMenu>
        </DropdownMenu>
      </div>
    );
  }
}

export default Presenter;
