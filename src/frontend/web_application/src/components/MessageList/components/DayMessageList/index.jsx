import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DateTime, FromNow } from '@gandi/react-translate';

import './style.scss';

const renderDate = (date) => {
  const dateAfter = new Date(date);
  dateAfter.setDate(dateAfter.getDate() + 3);
  const dateClassName = 'm-day-message-list__date';

  return dateAfter.getTime() >= Date.now() ?
    (<FromNow className={dateClassName} from={Date.now()}>{date}</FromNow>) :
    (<DateTime className={dateClassName} format="LL">{date}</DateTime>);
};

const DayMessageList = ({ date, className, ...props }) => (
  <div className="m-day-message-list">
    {renderDate(date)}
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
