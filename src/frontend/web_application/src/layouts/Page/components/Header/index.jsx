import React, { Component, PropTypes } from 'react';
import { withTranslator } from '@gandi/react-translate';
import { Link } from 'react-router';
import Button from '../../../Button';
import Icon from '../../../Icon';
import Presenter from './presenter';
import SearchField from './components/SearchField';
import UserMenu from './components/UserMenu';

@withTranslator()
class Header extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      searchAsDropdown: false,
    };
    this.handleClickToggleSearchAsDropdown = this.handleClickToggleSearchAsDropdown.bind(this);
  }

  handleClickToggleSearchAsDropdown() {
    this.setState({
      searchAsDropdown: !this.state.searchAsDropdown,
    });
  }

  render() {
    const { __ } = this.props;

    return (
      <Presenter
        brand={children => (<Link to="/">{children}</Link>)}
        searchAsDropdownToggler={(
          <Button
            aria-label={__('header.menu.toggle-search-form')}
            onClick={this.handleClickToggleSearchAsDropdown}
          ><Icon type="search" /></Button>
        )}
        searchAsDropdown={this.state.searchAsDropdown}
        search={<SearchField />}
        user={<UserMenu />}
      />
    );
  }
}

export default Header;
