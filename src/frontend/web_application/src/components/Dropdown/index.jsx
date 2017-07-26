import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

export const withDropdownControl = (WrappedComponent) => {
  const WithDropdownControl = ({ className, alignement, toggle, ...props }) => {
    const dropdownClassName = classnames(className, {
      'dropdown-float-right': alignement === 'right',
    });

    return (
      <WrappedComponent data-toggle={toggle} className={dropdownClassName} {...props} />
    );
  };

  WithDropdownControl.propTypes = {
    className: PropTypes.string,
    alignement: PropTypes.oneOf(['right']),
    toggle: PropTypes.string.isRequired,
  };
  WithDropdownControl.defaultProps = {
    className: null,
    alignement: null,
  };
  WithDropdownControl.displayName = `WithDropdownControl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithDropdownControl;
};

class Dropdown extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    position: PropTypes.oneOf(['bottom', 'left']),
    closeOnClick: PropTypes.bool,
    closeOnClickExceptSelectors: PropTypes.arrayOf(PropTypes.string),
    show: PropTypes.bool,
    children: PropTypes.node,
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    className: null,
    position: null,
    closeOnClick: false,
    closeOnClickExceptSelectors: null,
    show: false,
    children: undefined,
    onToggle: null,
  };

  componentDidMount() {
    this.$dropdown = jQuery(`#${this.props.id}`);
    // eslint-disable-next-line no-new
    new Foundation.Dropdown(this.$dropdown, {
      hOffset: 0,
      vOffset: 0,
    });
    // `positionClass` option (eg. 'right bottom') is always overriden
    // use css classes instead (cf. alignement and position)
    // see https://github.com/zurb/foundation-sites/pull/9019

    if (this.onToggle) {
      this.$dropdown.on('show.zf.dropdown', () => {
        this.onToggle(true);
      });
      this.$dropdown.on('hide.zf.dropdown', () => {
        this.onToggle(false);
      });
    }

    if (this.props.closeOnClickExceptSelectors) {
      this.handleDocumentClick = (ev) => {
        if (!this.props.show) {
          return;
        }

        const target = ev.target;

        if (this.$dropdown.is(target) || this.$dropdown.find(target).length) {
          return;
        }


        const targetToIgnore = this.props.closeOnClickExceptSelectors
          .find(selector => $(selector).is(target));

        if (targetToIgnore) {
          return;
        }

        this.show(false);
      };

      document.addEventListener('click', this.handleDocumentClick);
    }

    this.show(this.props.show);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this.show(nextProps.show);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  componentWillUnMount() {
    if (this.handleDocumentClick) {
      document.removeEventListener('click', this.handleDocumentClick);
    }
  }

  show(isVisible) {
    return isVisible ? this.$dropdown.foundation('open') : this.$dropdown.foundation('close');
  }

  render() {
    const {
      id,
      closeOnClick,
      className,
      position,
      onToggle,
      closeOnClickExceptSelectors, // declare here because can't be passed to <div>
      show, // declare here because can't be passed to <div>
      ...props
    } = this.props;
    this.onToggle = onToggle;

    const dropdownProps = {
      ...props,
      id,
      'data-close-on-click': closeOnClick,
      className: classnames('m-dropdown', className, position),
    };

    return <div {...dropdownProps} />;
  }
}

export default Dropdown;
