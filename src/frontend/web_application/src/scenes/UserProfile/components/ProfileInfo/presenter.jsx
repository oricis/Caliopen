import React, { PropTypes, Component } from 'react';
import Moment from 'react-moment';
import classnames from 'classnames';
import Link from '../../../../components/Link';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';

import './style.scss';

class ProfileInfo extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    locale: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: undefined,
    locale: undefined,
  };

  render() {
    const { user, className, __, locale } = this.props;

    return (
      <div className={classnames('m-profile-details', className)}>
        <div className="m-profile-details__header">
          <div className="m-profile-details__avatar-wrapper">
            <ContactAvatarLetter contact={user.contact} className="m-profile-details__avatar" />
          </div>
        </div>
        <div className="m-profile-details__name">
          <h3 className="m-profile-details__title">{user.name}</h3>
          <h4 className="m-profile-details__subtitle">
            {user.given_name}{user.given_name && ' '}{user.family_name}
          </h4>
          <p>{__('user.profile.subscribed_date')}
            <Moment
              className="m-profile-details__subscribed-date"
              format="ll"
              locale={locale}
            >{user.date_insert}</Moment>
          </p>
        </div>

        <div className="m-profile-details__rank">
          <div className="m-profile-details__rank-badge" />
          <div className="m-profile-details__rank-info">
            <h4 className="m-profile-details__rank-title">{__('fake rank')}</h4>
            <Link to="">{__('user.action.improve_rank')}</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileInfo;
