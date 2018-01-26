import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

class Checkbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    indeterminate: PropTypes.bool,
    showLabelforSr: PropTypes.bool,
  };

  static defaultProps = {
    indeterminate: null,
    showLabelforSr: false,
  };

  state = {}

  componentDidMount() {
    // this sets indeterminate attribute:
    this.selector.indeterminate = this.props.indeterminate;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.indeterminate !== this.props.indeterminate) {
      this.selector.indeterminate = this.props.indeterminate;
    }
  }

  render() {
    const { id, label, showLabelforSr, indeterminate, ...inputProps } = this.props;

    return (
      <div className="m-bright-checkbox">
        <input
          type="checkbox"
          className="m-bright-checkbox__input"
          ref={el => (this.selector = el)}
          id={id}
          {...inputProps}
        />
        <label
          className={classnames('m-bright-checkbox__label', {
            'show-for-sr': showLabelforSr,
          })}
          htmlFor={id}
        >{label}</label>
      </div>
    );
  }
}

export default Checkbox;
