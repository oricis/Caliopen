import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classnames from 'classnames';
import { formatName } from '../../../../services/contact';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';
import { WithSettings } from '../../../../modules/settings';


import './style.scss';

class ProfileInfo extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    className: PropTypes.string,
    locale: PropTypes.string,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    user: undefined,
    className: undefined,
    locale: undefined,
  };

  render() {
    const { user, className, i18n } = this.props;

    return (
      <WithSettings
        render={(settings) => {
          const format = settings.contact_display_format;
          const contact = user && user.contact;

          return (
            <div className={classnames('m-user-profile-details', className)}>
              <div className="m-user-profile-details__header">
                <div className="m-user-profile-details__avatar-wrapper">
                  {user && (
                    <ContactAvatarLetter
                      contact={user.contact}
                      contactDisplayFormat={format}
                      className="m-user-profile-details__avatar"
                    />
                  )}
                </div>
              </div>
              <div className="m-user-profile-details__name">
                <h3 className="m-user-profile-details__title">{user && user.name}</h3>
                <h4 className="m-user-profile-details__subtitle">
                  {user && user.contact && formatName({ contact, format })}
                </h4>
                <p>{i18n._('user.profile.subscribed_date')}
                  {user && (
                    <Moment
                      className="m-user-profile-details__subscribed-date"
                      format="ll"
                      locale={settings.locale}
                    >{user.date_insert}</Moment>
                  )}
                </p>
              </div>

              {/* "rank" is not implemt by now
              <div className="m-user-profile-details__rank">
                <div className="m-user-profile-details__rank-badge" />
                <div className="m-user-profile-details__rank-info">
                  <h4 className="m-user-profile-details__rank-title">fake rank</h4>
                  <Link to="">{__('user.action.improve_rank')}</Link>
                </div>
              </div>
              */}

            </div>
          );
        }}
      />
    );
  }
}

export default ProfileInfo;
