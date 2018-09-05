import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { withRouter } from 'react-router-dom';
import { withCurrentTab, withUpdateTab, Tab } from '../../../modules/tab';
import { addEventListener } from '../../../services/event-manager';

const SCROLL_DEBOUNCE_WAIT = 700;

// XXX: may be scrollRestauration will be usefull https://reacttraining.com/react-router/web/guides/scroll-restoration
const withScrollManager = () => (Component) => {
  @withUpdateTab()
  @withCurrentTab()
  @withRouter
  class ScrollManager extends PureComponent {
    static propTypes = {
      updateTab: PropTypes.func.isRequired,
      currentTab: PropTypes.shape({ scrollY: PropTypes.number }),
      location: PropTypes.shape({
        hash: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
      }).isRequired,
    };

    static defaultProps = {
      currentTab: undefined,
    };

    state = { alreadyScrolledContext: '' };

    componentDidMount() {
      this.unmounted = false;
      this.unsubscribeScrollEvent = addEventListener('scroll', debounce(
        this.saveScrollPosition,
        SCROLL_DEBOUNCE_WAIT, { trailing: true }
      ));
    }

    componentDidUpdate() {
      if (this.props.currentTab) {
        const { currentTab: { scrollY }, location } = this.props;
        const hash = location.hash && location.hash.length > 1 ? location.hash.slice(1) : '';
        if (
          hash === ''
          && !Number.isNaN(scrollY)
          && this.state.alreadyScrolledContext !== this.props.location.key
        ) {
          window.scrollTo(0, scrollY);
        }
      }
    }

    componentWillUnmount() {
      if (this.unsubscribeScrollEvent) this.unsubscribeScrollEvent();
      this.unmounted = true;
    }

    saveScrollPosition = () => {
      if (this.unmounted === true) return;

      const { currentTab, updateTab: setTabScroll } = this.props;
      const { scrollY: newScrollY } = window;
      const tab = new Tab({ ...currentTab, scrollY: newScrollY });

      setTabScroll({ tab, original: currentTab });
      this.setState({ alreadyScrolledContext: this.props.location.key });
    }

    shouldScrollToTarget = () => this.props.location.key;

    render() {
      return <Component scrollToTarget={this.shouldScrollToTarget} {...this.props} />;
    }
  }

  return ScrollManager;
};

export default withScrollManager;
