import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';
import './style.scss';

const UserInfo = ({ user, className }) => (
  <div className={classnames('m-user-info', className)}>
    {user && user.contact && (
      <div className="m-user-info__avatar">
        <ContactAvatarLetter contact={user.contact} modifiers={{ size: 'small' }} />
      </div>
    )}
    <div className="m-user-info__username">{user.name}</div>
  </div>
);

UserInfo.propTypes = {
  user: PropTypes.shape(),
  className: PropTypes.text,
};
UserInfo.defaultProps = {
  user: {},
  className: undefined,
};

export default UserInfo;
