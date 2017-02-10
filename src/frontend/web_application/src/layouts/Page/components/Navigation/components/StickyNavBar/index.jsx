import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

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
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(ev) {
    const scrollSize = ev.srcElement.documentElement.scrollTop || window.scrollY;

    this.setState({ isSticky: scrollSize > 10 });
  }

  render() {
    const { className: initialClassName, stickyClassName, ...props } = this.props;
    const className = classnames(initialClassName, { [stickyClassName]: this.state.isSticky });

    return <div className={className} {...props} />;
  }
}

export default StickyNavbarClass;
