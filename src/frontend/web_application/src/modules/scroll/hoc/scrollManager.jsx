import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { hashSelector, locationKeySelector } from '../../../store/selectors/router';
import { withCurrentTab } from '../../../hoc/tab';
import { updateTab } from '../../../store/modules/tab';
import { addEventListener } from '../../../services/event-manager';

const SCROLL_DEBOUNCE_WAIT = 700;

const mapStateToProps = (state) => {
  const fullHash = hashSelector(state);

  return {
    hash: fullHash && fullHash.length > 1 ? fullHash.slice(1) : '',
    locationKey: locationKeySelector(state),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTab,
}, dispatch);

const withScrollManager = () => (Component) => {
  class ScrollManager extends PureComponent {
    static propTypes = {
      updateTab: PropTypes.func.isRequired,
      hash: PropTypes.string,
      currentTab: PropTypes.shape({ scrollY: undefined }),
      locationKey: PropTypes.string.isRequired,
    };

    static defaultProps = {
      hash: undefined,
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
        const { scrollY } = this.props.currentTab;

        if (this.props.hash === ''
          && !Number.isNaN(scrollY)
          && this.state.alreadyScrolledContext !== this.props.locationKey
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
      const tab = { ...currentTab, scrollY: newScrollY };

      setTabScroll({ tab, original: currentTab });
      this.setState({ alreadyScrolledContext: this.props.locationKey });
    }

    shouldScrollToTarget = () => this.props.locationKey;

    render() {
      return <Component scrollToTarget={this.shouldScrollToTarget} {...this.props} />;
    }
  }

  return compose(connect(mapStateToProps, mapDispatchToProps), withCurrentTab())(ScrollManager);
};

export default withScrollManager;
