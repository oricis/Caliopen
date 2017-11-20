import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { scroll } from '../../services/scroll';

class ScrollToWhenHash extends PureComponent {
  static propTypes = {
    hash: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    forceTop: PropTypes.bool,
  };
  static defaultProps = {
    className: undefined,
    children: null,
    hash: undefined,
    id: undefined,
    forceTop: false,
  };

  static contextTypes = {
    scrollSpySubscribe: PropTypes.func,
  };

  componentDidMount() {
    const { id, hash, forceTop } = this.props;

    if (!forceTop && id === hash.replace('#', '')) {
      const divRect = this.scrollDiv.getBoundingClientRect();
      // XXX: remove dependency to window
      const top = divRect.top + window.scrollY;
      scroll(0, top - 120);
    }

    if (forceTop) {
      scroll(0, 0);
    }

    if (this.context.scrollSpySubscribe) {
      this.unsubscribeScrollSpy = this.context.scrollSpySubscribe(this.scrollDiv);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeScrollSpy) {
      this.unsubscribeScrollSpy();
    }
  }

  render() {
    const { className, id } = this.props;

    return (
      <div className={className} ref={(div) => { this.scrollDiv = div; }} id={id}>
        {this.props.children}
      </div>
    );
  }
}

export default ScrollToWhenHash;
