import React, { Component, forwardRef, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import { getDropdownStyle } from './services/getDropdownStyle';
import { addEventListener } from '../../services/event-manager';
import './style.scss';

export const CONTROL_PREFIX = 'toggle';
const CLOSE_ON_CLICK_ALL = 'all';
const CLOSE_ON_CLICK_EXCEPT_SELF = 'exceptSelf';
const DO_NOT_CLOSE = 'doNotClose';

export const withDropdownControl = (WrappedComponent) => {
  const WithDropdownControl = ({ toggleId, ...props }, ref) => {
    if (!ref) {
      throw new Error(`a ref is mandatory for a dropdown controller created with "${WrappedComponent.displayName || WrappedComponent.name || 'Component'}"`);
    }

    return (
      <WrappedComponent
        role="button"
        tabIndex="0"
        ref={ref}
        {...props}
      />
    );
  };

  WithDropdownControl.displayName = `WithDropdownControl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return forwardRef(WithDropdownControl);
};

class Dropdown extends Component {
  static propTypes = {
    alignRight: PropTypes.bool, // force align right
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    className: PropTypes.string,
    closeOnClick: PropTypes.oneOf([CLOSE_ON_CLICK_ALL, CLOSE_ON_CLICK_EXCEPT_SELF, DO_NOT_CLOSE]),
    closeOnScroll: PropTypes.bool, // should Dropdown close on windows scroll ?
    isMenu: PropTypes.bool,
    onToggle: PropTypes.func,
    innerRef: PropTypes.shape({ current: PropTypes.shape({}) }),
    dropdownControlRef: PropTypes.shape({ current: PropTypes.shape({}) }),
    show: PropTypes.bool,
    displayFirstLayer: PropTypes.bool,
  };

  static defaultProps = {
    alignRight: false,
    children: null,
    className: null,
    closeOnClick: CLOSE_ON_CLICK_EXCEPT_SELF,
    closeOnScroll: false,
    isMenu: false,
    onToggle: str => str,
    show: false,
    innerRef: undefined,
    dropdownControlRef: undefined,
    displayFirstLayer: false,
  };

  static defaultDropdownStyle = {
    // force postion in order to have the correct width when calc position
    top: 0,
    left: 0,
  };

  constructor(props) {
    super(props);
    this.dropdownRef = props.innerRef || createRef();
  }

  state = {
    isOpen: false,
    dropdownStyle: this.constructor.defaultDropdownStyle,
  };


  componentDidMount() {
    const { dropdownControlRef } = this.props;
    this.toggle(this.props.show);

    if (this.props.closeOnClick !== DO_NOT_CLOSE) {
      this.unsubscribeClickEvent = addEventListener('click', (ev) => {
        const { target } = ev;

        const dropdownClick = this.dropdownRef.current === target ||
          this.dropdownRef.current.contains(target);
        const controlClick = dropdownControlRef &&
          (dropdownControlRef.current === target || dropdownControlRef.current.contains(target));

        if (controlClick) {
          this.toggle(!this.state.isOpen);

          return;
        }

        if (this.props.closeOnClick === CLOSE_ON_CLICK_EXCEPT_SELF && dropdownClick) { return; }

        this.toggle(false);
      });
    }

    this.unsubscribeResizeEvent = addEventListener('resize', () => {
      // this prevent dropdown to be misplaced on window resize
      // TODO: get new offset instead of closing dropdown
      this.toggle(false);
    });

    this.unsubscribeScrollEvent = this.props.closeOnScroll ? addEventListener('scroll', throttle(() => {
      const scrollSize = window.scrollY;
      const closeDropdown = scrollSize > 10;

      if (closeDropdown) {
        this.toggle(false);
      }
    }, 100, { leading: true, trailing: true })) : () => {};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this.toggle(nextProps.show);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeClickEvent) {
      this.unsubscribeClickEvent();
    }
    this.unsubscribeResizeEvent();
    this.unsubscribeScrollEvent();
  }

  toggle = (isVisible) => {
    this.setState((prevState) => {
      // update offset only if prevState.isOpen is false
      // otherwise return prevState.offset
      const newStyle = prevState.isOpen ? prevState.dropdownStyle : this.updateDropdownStyle();

      if (isVisible !== prevState.isOpen) { this.props.onToggle(isVisible); }

      return {
        isOpen: isVisible !== prevState.isOpen && isVisible,
        dropdownStyle: isVisible ? newStyle : this.constructor.defaultDropdownStyle,
      };
    });
  }

  updateDropdownStyle = () => {
    const { alignRight, dropdownControlRef } = this.props;

    // if no dropdownControl declared, return empty dropdownStyle
    // otherwise, return new dropdownStyle
    return dropdownControlRef ?
      getDropdownStyle({
        alignRight,
        controlElement: dropdownControlRef.current,
        dropdownElement: this.dropdownRef.current,
      }) :
      this.constructor.defaultDropdownStyle;
  }

  render() {
    const {
      id, className, children, isMenu, displayFirstLayer,
    } = this.props;

    const dropdownProps = {
      id,
      className: classnames(
        'm-dropdown',
        { 'm-dropdown--is-open': this.state.isOpen },
        { 'm-dropdown--is-menu': isMenu },
        { 'm-dropdown--display-first-layer': displayFirstLayer },
        className,
      ),
      tabIndex: 0,
      role: 'presentation',
      style: this.state.dropdownStyle,
    };

    return (
      <div ref={this.dropdownRef} {...dropdownProps}>
        {children}
      </div>
    );
  }
}

export default forwardRef((props, ref) => <Dropdown {...props} innerRef={ref} />);
