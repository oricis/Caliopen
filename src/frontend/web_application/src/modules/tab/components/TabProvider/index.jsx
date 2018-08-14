import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { matchPath } from 'react-router-dom';
import { Tab } from '../../model/Tab';
import { TabContext } from '../../contexts/TabContext';
import { locationSelector } from '../../../../store/selectors/router';
import { RoutingConsumer, flattenRouteConfig, findTabbableRouteConfig } from '../../../../modules/routing';

const mapStateToProps = state => ({
  location: locationSelector(state),
});
const mapDispatchToProps = dispatch => bindActionCreators({
  push,
}, dispatch);

const withRoutes = () => C => props => (
  <RoutingConsumer
    render={({ routes }) => (
      <C routes={routes} {...props} />
    )}
  />
);

@connect(mapStateToProps, mapDispatchToProps)
@withRoutes()
@withI18n()
class TabProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.shape({ pathname: PropTypes.string }),
    i18n: PropTypes.shape({}).isRequired,
    push: PropTypes.func.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };
  static defaultProps = {
    children: null,
    location: {},
  };
  state = {
    tabs: [],
    removeTab: () => {},
    updateTab: () => {},
  };

  componentWillMount() {
    this.setState({
      removeTab: this.removeTab,
      updateTab: this.updateTab,
    });
    this.initializeApps();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState(prevState => ({
        tabs: this.updateOrAddTab({ location: nextProps.location, tabs: prevState.tabs }),
      }));
    }
  }

  initializeApps = () => {
    const tabs = [
      new Tab({
        location: this.normalizeLocation({ pathname: '/' }),
      }),
      new Tab({
        location: this.normalizeLocation({ pathname: '/contacts' }),
      }),
    ];
    const { location } = this.props;

    this.setState({
      tabs: this.updateOrAddTab({ location, tabs }),
    });
  }

  removeTab = ({ tab }) => {
    this.setState(prevState => ({
      tabs: prevState.tabs.filter(i => i !== tab),
    }), () => {
      this.props.push('/');
    });
  }

  updateTab = ({ tab, original }) => {
    this.setState((prevState) => {
      const i = prevState.tabs.indexOf(original);
      const nextTabs = [...prevState.tabs];

      nextTabs[i] = tab;

      return {
        tabs: nextTabs,
      };
    });
  }

  normalizeLocation = ({ pathname = '', search = '', hash = '' }) => ({ pathname, search, hash });

  updateOrAddTab = ({ location, tabs }) => {
    if (!location) {
      return tabs;
    }

    const { pathname } = location;

    const routeConfig = findTabbableRouteConfig({ pathname, routes: this.props.routes });

    // there might be a better way to select a tab whenever it can be by id or route pattern
    // e.g contacts/<contactId> -> each contact has a tab
    // settings/<cat> -> all sub routes uses only one tab
    const original = tabs.find((tab) => {
      const currentRouteConfig = findTabbableRouteConfig({
        pathname: tab.location.pathname, routes: this.props.routes,
      });

      return currentRouteConfig.tab.tabMatch({ pathname, tab, routeConfig: currentRouteConfig });
    });

    if (original) {
      const i = tabs.indexOf(original);
      const nextTabs = [...tabs];

      nextTabs[i] = new Tab({
        ...original,
        location: this.normalizeLocation(location),
      });

      return nextTabs;
    }

    if (routeConfig) {
      const nextTabs = [
        ...tabs,
        new Tab({
          location: this.normalizeLocation(location),
        }),
      ];

      return nextTabs;
    }

    return tabs;
  }

  findRouteConfig = pathname =>
    flattenRouteConfig(this.props.routes)
      .find(({
        tab, path, exact, strict,
      }) => !!tab && matchPath(pathname, { path, exact, strict }));


  render() {
    return (<TabContext.Provider value={this.state} {...this.props} />);
  }
}

export default TabProvider;
