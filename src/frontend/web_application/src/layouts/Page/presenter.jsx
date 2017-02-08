import React, { Component, PropTypes } from 'react';
import OffCanvas from './components/OffCanvas';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NavigationAlt from './components/NavigationAlt';
import NotificationCenter from './components/NotificationCenter';
import CallToAction from './components/CallToAction';
import './style.scss';

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
        <div className="l-body">
          <Header />
          <Navigation />
          <section role="main">
            <div className="l-body__content">
              {children}
            </div>
          </section>
          <CallToAction />
          <NotificationCenter />
        </div>
      </OffCanvas>
    );
  }
}

export default PageContainer;
