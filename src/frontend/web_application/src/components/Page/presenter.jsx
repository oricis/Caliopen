import React, { Component, PropTypes } from 'react';
import './style.scss';
import MainView from './components/MainView';
import OffCanvas from './components/OffCanvas';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NavigationAlt from './components/NavigationAlt';
import NotificationCenter from './components/NotificationCenter';
import CallToAction from './components/CallToAction';

class PageContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    requestUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.requestUser();
  }

  render() {
    const { children } = this.props;

    return (
      <OffCanvas leftChildren={<NavigationAlt />}>
        <MainView
          header={<Header />}
          nav={<Navigation />}
          callToAction={<CallToAction />}
          notification={<NotificationCenter />}
        >{ children }</MainView>
      </OffCanvas>
    );
  }
}

export default PageContainer;
