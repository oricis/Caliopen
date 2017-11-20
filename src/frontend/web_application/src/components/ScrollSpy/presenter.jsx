import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

const HEADER_HEIGHT = 120;

class ScrollSpy extends Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.shape({}),
    children: PropTypes.node,
    replaceLocation: PropTypes.func.isRequired,
  };
  static defaultProps = {
    location: undefined,
    className: undefined,
    children: null,
    currentTab: undefined,
  };

  static childContextTypes = {
    scrollSpySubscribe: PropTypes.func.isRequired,
  };

  state = {
    subscriptions: [],
  };

  getChildContext() {
    return {
      scrollSpySubscribe: (ref) => {
        this.setState(prevState => ({ subscriptions: [...prevState.subscriptions, ref] }));

        return () => this.setState(prevState => ({
          subscriptions: prevState.subscriptions.filter(subscription => subscription !== ref),
        }));
      },
    };
  }

  componentDidMount() {
    this.unsubscribeScrollEvent = addEventListener('scroll', throttle(() => {
      const { location } = this.props;
      if (!location) {
        return;
      }
      const domNode = this.getNearestElementFromTop(this.state.subscriptions);

      if (domNode && location.hash.replace('#', '') !== domNode.id) {
        this.props.replaceLocation({ ...location, hash: `#${domNode.id}` });
      }
    }, 10, { leading: true, trailing: true }));
  }

  componentWillUnmount() {
    if (this.unsubscribeScrollEvent) {
      this.unsubscribeScrollEvent();
    }
  }

  getTop = domNode => domNode.getBoundingClientRect().top - HEADER_HEIGHT;

  getNearestElementFromTop = subscriptions => subscriptions.reduce((acc, target) => {
    if (this.getTop(target) < 0) {
      return acc;
    }

    if (!acc || this.getTop(acc) > this.getTop(target)) {
      return target;
    }

    return acc;
  }, undefined);

  render() {
    const { className } = this.props;

    return (
      <div className={className}>{this.props.children}</div>
    );
  }
}

export default ScrollSpy;
