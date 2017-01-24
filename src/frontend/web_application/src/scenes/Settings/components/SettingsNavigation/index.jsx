import React, { Component, PropTypes } from 'react';
import Link from '../../../../components/Link';
import TextList, { ItemContent } from '../../../../components/TextList';

const NavigationItem = ({ active, title }) => (
  <ItemContent><Link active={active} className="s-settings__nav-item">{title}</Link></ItemContent>
);

NavigationItem.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
};

class SettingsNavigation extends Component {
  render() {
    return (
      <TextList className={this.props.className}>
        {this.props.links.map(nav =>
          <NavigationItem
            active={nav.link.active}
            title={nav.link.title}
          />
        )}
      </TextList>
    );
  }
}

SettingsNavigation.propTypes = {
  links: PropTypes.node,
  className: PropTypes.string,
};
export default SettingsNavigation;
