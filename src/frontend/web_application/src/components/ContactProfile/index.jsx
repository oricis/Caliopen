import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslator } from '@gandi/react-translate';
import Button from '../Button';
import Badge from '../Badge';
import MultidimensionalPi from '../../components/MultidimensionalPi';
import ContactAvatarLetter from '../ContactAvatarLetter';
import ContactProfileForm from './components/ContactProfileForm';
import './style.scss';

const FAKE_TAGS = ['Caliopen', 'Gandi', 'Macarons'];

function getContactTitle(contact) {
  const familyName = contact.family_name || '';
  const givenName = contact.given_name || '';
  const title = contact.title || '';

  if (!familyName && !givenName) { return title; }

  return `${familyName}${givenName && familyName && ', '}${givenName}`;
}

@withTranslator()
class ContactProfile extends Component {
  static propTypes = {
    contact: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: undefined,
  };

  state = {
    editProfile: false,
  };

  toggleEditProfile = () => {
    this.setState(prevState => ({
      ...prevState,
      editProfile: !prevState.editProfile,
    }));
  }

  render() {
    const { contact, className, onChange, editMode, __ } = this.props;
    const activeButtonProp = this.state.toggleEditProfile ? { color: 'active' } : {};

    return (
      <div className={classnames('m-contact-profile', className)}>
        <div className="m-contact-profile__header">
          <div className="m-contact-profile__avatar-wrapper">
            <ContactAvatarLetter contact={contact} className="m-contact-profile__avatar" />
          </div>

          <div className="m-contact-profile__name">
            <h3 className="m-contact-profile__title">
              {getContactTitle(contact)}
            </h3>
          </div>

          <div className="m-contact-profile__edit-button">
            {editMode && (
              <Button
                icon="caret-down"
                display="inline"
                {...activeButtonProp}
                onClick={this.toggleEditProfile}
              >
                <span className="show-for-sr">
                  {__('contact_profile.action.edit_contact')}
                </span>
              </Button>
            )}
          </div>

        </div>

        {this.state.editProfile &&
          <ContactProfileForm contact={contact} onChange={onChange} />
        }

        {// contact.tags &&
          // FIXME: contact.tags replaced with FAKE_TAGS for testing purpose
          <div className="m-contact-profile__tags">
            {FAKE_TAGS.map(tag => (
              <Badge className="m-contact-profile__tag" key={tag}>{tag}</Badge>
            ))}
          </div>
        }

        {contact.pi && !editMode && (

        // FIXME: on mobile, MultidimensionalPi should be displayed on
        // 2 columns (graph on left, rates on right)

          <MultidimensionalPi className="m-contact-profile__pi" pi={contact.pi} />
        )}
      </div>
    );
  }
}

export default ContactProfile;
