import React, { PropTypes, Component } from 'react';
import Moment from 'react-moment';
import classnames from 'classnames';
import Link from '../../../../components/Link';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';

import './style.scss';

class ProfileInfo extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    className: PropTypes.string,
    locale: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: undefined,
    className: undefined,
    locale: undefined,
  };

  render() {
    const { user, className, __, locale } = this.props;

    return (
      <div className={classnames('m-user-profile-details', className)}>
        <div className="m-user-profile-details__header">
          <div className="m-user-profile-details__avatar-wrapper">
            {user && (
              <ContactAvatarLetter
                contact={user.contact}
                className="m-user-profile-details__avatar"
              />
            )}
          </div>
        </div>
        <div className="m-user-profile-details__name">
          <h3 className="m-user-profile-details__title">{user && user.name}</h3>
          <h4 className="m-user-profile-details__subtitle">
            {user && `${user.given_name}${user.given_name} ${user.family_name}`}
          </h4>
          <p>{__('user.profile.subscribed_date')}
            {user && (
              <Moment
                className="m-user-profile-details__subscribed-date"
                format="ll"
                locale={locale}
              >{user.date_insert}</Moment>
            )}
          </p>
        </div>

        <div className="m-user-profile-details__rank">
          <div className="m-user-profile-details__rank-badge" />
          <div className="m-user-profile-details__rank-info">
            <h4 className="m-user-profile-details__rank-title">fake rank</h4>
            <Link to="">{__('user.action.improve_rank')}</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileInfo;
