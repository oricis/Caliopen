import React, { Component, PropTypes } from 'react';
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
    const $dropdown = jQuery(`#${this.props.id}`);
    // eslint-disable-next-line no-new
    new Foundation.Dropdown($dropdown, {
      hOffset: 0,
      vOffset: 0,
    });
    // `positionClass` option (eg. 'right bottom') is always overriden
    // use css classes instead (cf. alignement and position)
    // see https://github.com/zurb/foundation-sites/pull/9019

    if (this.onToggle) {
      $dropdown.on('show.zf.dropdown', () => {
        this.onToggle(true);
      });
      $dropdown.on('hide.zf.dropdown', () => {
        this.onToggle(false);
      });
    }
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
  position: PropTypes.oneOf(['bottom']),
  closeOnClick: PropTypes.bool,
  onToggle: PropTypes.func,
};

Dropdown.defaultProps = {
  className: null,
  position: null,
  closeOnClick: false,
  onToggle: null,
};

export default Dropdown;
