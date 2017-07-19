import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker'; // https://github.com/Hacker0x01/react-datepicker
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';

class DatePickerGroup extends Component {
  static propTypes = {
    calendarClassName: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    inputClassName: PropTypes.string,
    label: PropTypes.string,
    onDateChange: PropTypes.func.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
  };
  static defaultProps = {
    calendarClassName: null,
    className: null,
    inputClassName: null,
    label: null,
  };

  state = {
    startDate: null,
  };

  render() {
    const {
      calendarClassName,
      className,
      id,
      inputClassName,
      label,
      onDateChange,
      startDate,
      ...props
    } = this.props;

    return (
      <div className={classnames('m-date-picker-group', className)}>

        {label && <label htmlFor={id}>{label}</label> }

        <DatePicker
          id={id}
          className={classnames('m-date-picker-group__input', inputClassName)}
          calendarClassName={classnames('m-date-picker-group__calendar', calendarClassName)}
          selected={moment(startDate)}
          onChange={onDateChange}
          {...props}
        />
      </div>

    );
  }
}

export default DatePickerGroup;
