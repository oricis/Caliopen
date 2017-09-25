import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

const THROTTLE_INTERVAL = 100;
const FOOTER_HEIGHT = 300;

class InfiniteScroll extends Component {
  static propTypes = {
    onReachBottom: PropTypes.func.isRequired,
    children: PropTypes.node,
  };
  static defaultProps = {
    children: undefined,
  };

  componentDidMount() {
    this.handleScroll = throttle(() => {
      const scrollSize = window.scrollY || document.documentElement.scrollTop;
      const { scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - (clientHeight + scrollSize) <= FOOTER_HEIGHT) {
        this.props.onReachBottom();
      }
    }, THROTTLE_INTERVAL, { leading: true, trailing: false });
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default InfiniteScroll;
