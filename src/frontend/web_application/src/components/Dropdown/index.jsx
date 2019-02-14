import React, { Component } from 'react';
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
  const WithDropdownControl = ({ toggleId, className, ...props }) => {
    const triggerClassName = classnames(
      'm-dropdown__trigger',
      className,
    );
    const id = `${CONTROL_PREFIX}-${toggleId}`;

    return (
      <WrappedComponent
        id={id}
        className={triggerClassName}
        role="button"
        tabIndex="0"
        {...props}
      />
    );
  };

  WithDropdownControl.propTypes = {
    className: PropTypes.string,
    toggleId: PropTypes.string.isRequired,
  };
  WithDropdownControl.defaultProps = {
    className: null,
  };
  WithDropdownControl.displayName = `WithDropdownControl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithDropdownControl;
};


class Dropdown extends Component {
  static propTypes = {
    // XXX: refactor id to ref
    id: PropTypes.string.isRequired,
    alignRight: PropTypes.bool, // force align right
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    className: PropTypes.string,
    closeOnClick: PropTypes.oneOf([CLOSE_ON_CLICK_ALL, CLOSE_ON_CLICK_EXCEPT_SELF, DO_NOT_CLOSE]),
    closeOnScroll: PropTypes.bool, // should Dropdown close on windows scroll ?
    isMenu: PropTypes.bool,
    position: PropTypes.oneOf(['top', 'bottom']),
    onToggle: PropTypes.func,
    dropdownRef: PropTypes.func,
    show: PropTypes.bool,
  };

  static defaultProps = {
    alignRight: false,
    children: null,
    className: null,
    closeOnClick: CLOSE_ON_CLICK_EXCEPT_SELF,
    closeOnScroll: false,
    position: 'bottom',
    isMenu: false,
    onToggle: str => str,
    show: false,
    dropdownRef: () => {},
  };

  static defaultDropdownStyle = {
    top: undefined,
    left: undefined,
  };

  state = {
    isOpen: false,
    dropdownStyle: this.constructor.defaultDropdownStyle,
  };

  componentDidMount() {
    this.dropdownControl = document.getElementById(`${CONTROL_PREFIX}-${this.props.id}`);
    this.toggle(this.props.show);

    if (this.props.closeOnClick !== DO_NOT_CLOSE) {
      this.unsubscribeClickEvent = addEventListener('click', (ev) => {
        const { target } = ev;

        const dropdownClick = this.dropdown === target || this.dropdown.contains(target);
        const controlClick = this.dropdownControl &&
          (this.dropdownControl === target || this.dropdownControl.contains(target));

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
    const { alignRight, position } = this.props;
    const control = this.dropdownControl;
    const { dropdown } = this;

    // if no dropdownControl declared, return empty dropdownStyle
    // otherwise, return new dropdownStyle
    return control ?
      getDropdownStyle({
        alignRight, position, control, dropdown,
      }) :
      this.constructor.defaultDropdownStyle;
  }

  render() {
    const {
      id, className, children, isMenu, dropdownRef,
    } = this.props;

    const dropdownProps = {
      id,
      className: classnames(
        'm-dropdown',
        { 'm-dropdown--is-open': this.state.isOpen },
        { 'm-dropdown--is-menu': isMenu },
        className,
      ),
      tabIndex: 0,
      role: 'presentation',
      style: this.state.dropdownStyle,
    };

    return (
      <div ref={(node) => { this.dropdown = node; dropdownRef(node); }} {...dropdownProps}>
        {children}
      </div>
    );
  }
}

export default Dropdown;
