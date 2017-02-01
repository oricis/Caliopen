import React, { PropTypes } from 'react';
import Button from '../../../../components/Button';
import TextList, { ItemContent } from '../../../../components/TextList';

const navigationLinks = [
  /* eslint-disable */
  {'link': {'title': 'User Interface', 'href': '#', active: false}},
  {'link': {'title': 'View', 'href': '#', active: false}},
  {'link': {'title': 'Contacts', 'href': '#', active: false}},
  {'link': {'title': 'Calendar', 'href': '#', active: false}},
  {'link': {'title': 'Server', 'href': '#', active: false}},
  {'link': {'title': 'Devices', 'href': '#', active: true}},
];
  /* eslint-enable */

const NavigationItem = ({ active, title }) => (
  <ItemContent><Button active={active} className="s-settings__item">{title}</Button></ItemContent>
);

NavigationItem.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
};

const SettingsNavigation = ({ className }) => (
  <TextList className={className}>
    {navigationLinks.map(nav =>
      <NavigationItem
        active={nav.link.active}
        title={nav.link.title}
        key={nav.link.title}
      />
    )}
  </TextList>
);

SettingsNavigation.propTypes = {
  className: PropTypes.string,
};
export default SettingsNavigation;
