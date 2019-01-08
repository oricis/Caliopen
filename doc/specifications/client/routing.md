# How to create a route

## Scene

Create a scene component for example `src/scenes/Foobar`



## Route Config

Edit the file `src/modules/routing/components/RoutingProvider.jsx`, and add the config:

```js
import Foobar from '../../../scenes/Foobar';
// …

{
  path: '/foobar',
  exact: true,
  component: Foobar,
  app: 'contact',
  tab: {
    type: 'default',
    icon: 'foobar',
    renderLabel: () => i18n._('route.foobar.label', null, { defaults: 'Foobar' }),
    // use tabMatchPathname or tabMatchRoute when path uses params e.g. /foobar/:id
    tabMatch: tabMatchPathname,
  },
}
```

## Tab implementation

**Optionnally** use a specific tab for a custom label or icon to render.

Change the tab's type previously set:

```diff
tab: {
    -type: 'default',
    +type: 'foobar',
    icon: 'foobar',
    renderLabel: () => i18n._('route.foobar.label', null, { defaults: 'Foobar' }),
```

_**FIXME:** finish refactor and rename Page2 into Page_

Create a tab component in `src/layouts/Page2/components/Navbar/components`


```
import React from 'react';
import classnames from 'classnames';
// …
import { Icon } from '../../../../../../components';
import { getTabUrl } from '../../../../../../modules/tab';
import Tab from '../Tab';
import NavbarItem from '../NavbarItem';
import ItemLink from '../ItemLink';
import ItemButton from '../ItemButton';

// …

class FoobarTab extends Tab {
  render() {
    const {
      className,
      isActive,
      tab,
      routeConfig,
    } = this.props;

    const label = routeConfig.tab.renderLabel();

    return (
      <NavbarItem
        className={classnames('m-tab', className)}
        active={isActive}
        contentChildren={(
          <ItemLink
            to={getTabUrl(tab.location)}
            title={label}
            className="m-tab__content"
          >
            <Icon type="foobar" className="m-tab__icon" rightSpaced />
            {label}
          </ItemLink>
        )}
        actionChildren={<ItemButton onClick={this.handleRemove} icon="remove" className="m-tab__action" />}
      />
    );
  }
}
```

Edit the file `src/layouts/Page2/components/Navigation/presenter.jsx` and make a condition to render the specific tab:

```
switch (routeConfig.tab.type) {
  // …
  case 'foobar':
    return (
      <FoobarTab
        key={this.getTabIdentifier(tab.location)}
        tab={tab}
        routeConfig={routeConfig}
        isActive={isActive}
        onRemove={removeTab}
      />
    );
```
