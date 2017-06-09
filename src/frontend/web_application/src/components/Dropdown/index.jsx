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

  show(isVisible) {
    return isVisible ? this.$dropdown.foundation('open') : this.$dropdown.foundation('close');
  }

  render() {
    const { id, closeOnClick, className, position, onToggle, ...props } = this.props;
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

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  position: PropTypes.oneOf(['bottom', 'left']),
  closeOnClick: PropTypes.bool,
  show: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onToggle: PropTypes.func,
};

Dropdown.defaultProps = {
  className: null,
  position: null,
  closeOnClick: false,
  onToggle: null,
  show: false,
};

export default Dropdown;
