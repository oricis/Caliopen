import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { scrollTop, getViewPortTop } from '../';

export default () => (Component) => {
  class ScrollTarget extends PureComponent {
    static propTypes = {
      scrollToMe: PropTypes.func,
    };

    static defaultProps = {
      scrollToMe: undefined,
    }

    state = { alreadyScrolledContext: undefined };

    componentDidMount = () => this.scroll();
    componentDidUpdate = () => this.scroll();

    getRef = (ref) => {
      this.element = ref;
    }

    scroll = () => {
      if (!this.props.scrollToMe || !this.element) return;

      const scrollContext = this.props.scrollToMe();

      if (this.state.alreadyScrolledContext !== scrollContext) {
        const top = getViewPortTop(this.element);
        scrollTop(top);

        this.setState({ alreadyScrolledContext: scrollContext });
      }
    }

    render() {
      return (<Component forwardRef={this.getRef} {...this.props} />);
    }
  }

  return ScrollTarget;
};
