import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { DateTime, FromNow } from '@gandi/react-translate';

import './style.scss';

const renderDate = (date) => {
  const dateAfter = new Date(date);
  dateAfter.setDate(dateAfter.getDate() + 3);

  return dateAfter.getTime() >= Date.now() ?
    (<FromNow from={Date.now()}>{date}</FromNow>) :
    (<DateTime format="LL">{date}</DateTime>);
};

const DayMessageList = ({ date, className, ...props }) => (
  <div className="m-day-message-list">
    <div className="m-day-message-list__day">{renderDate(date)}</div>
    <div className={classnames('m-day-message-list__messages', className)} {...props} />
  </div>
);

DayMessageList.propTypes = {
  date: PropTypes.string.isRequired,
  className: PropTypes.string,
};
DayMessageList.defaultProps = {
  className: null,
};

export default DayMessageList;
