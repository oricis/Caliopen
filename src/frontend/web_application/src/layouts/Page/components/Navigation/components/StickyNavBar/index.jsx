import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import throttle from 'lodash.throttle';

class StickyNavbarClass extends Component {
  static propTypes = {
    className: PropTypes.string,
    stickyClassName: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      isSticky: false,
    };
  }

  componentDidMount() {
    this.handleScroll = throttle(() => {
      const scrollSize = window.scrollY || document.documentElement.scrollTop;
      const isSticky = scrollSize > 10;

      if (this.state.isSticky !== isSticky) {
        this.setState({ isSticky });
      }
    }, 100, { leading: true, trailing: true });
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { className: initialClassName, stickyClassName, ...props } = this.props;
    const className = classnames(initialClassName, { [stickyClassName]: this.state.isSticky });

    return <div className={className} {...props} />;
  }
}

export default StickyNavbarClass;
