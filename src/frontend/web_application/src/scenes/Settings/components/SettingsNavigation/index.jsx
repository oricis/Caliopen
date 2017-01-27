import React, { PropTypes } from 'react';
import Link from '../../../../components/Link';
import TextList, { ItemContent } from '../../../../components/TextList';

const NavigationItem = ({ active, title }) => (
  <ItemContent><Link active={active} className="s-settings__item" noDecoration>{title}</Link></ItemContent>
);

NavigationItem.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
};

const SettingsNavigation = ({ links, className }) => (
  <TextList className={className}>
    {links.map(nav =>
      <NavigationItem
        active={nav.link.active}
        title={nav.link.title}
        key={nav.link.title}
      />
    )}
  </TextList>
);

SettingsNavigation.propTypes = {
  links: PropTypes.node,
  className: PropTypes.string,
};
export default SettingsNavigation;
