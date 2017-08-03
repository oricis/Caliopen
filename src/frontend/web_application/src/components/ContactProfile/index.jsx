import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { withTranslator } from '@gandi/react-translate';
import Button from '../Button';
import Badge from '../Badge';
import MultidimensionalPi from '../../components/MultidimensionalPi';
import ContactAvatarLetter from '../ContactAvatarLetter';
import ContactProfileForm from './components/ContactProfileForm';
import './style.scss';

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
            <h3 className="m-contact-profile__title">{contact.title}</h3>
            <h4 className="m-contact-profile__subtitle">
              {contact.name_prefix}{contact.name_prefix && ' '}
              {contact.given_name}{contact.given_name && ' '}
              {contact.family_name}{contact.name_suffix && ' '}
              {contact.name_suffix}
            </h4>
          </div>

          <div className="m-contact-profile__edit-button">
            {editMode && (
              <Button
                icon="edit"
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


        {contact.tags &&
          <div className="m-contact-profile__tags">
            {contact.tags.map(tag => (
              <Badge className="m-contact-profile__tag" key={tag}>{tag}</Badge>
            ))}
          </div>
        }
        {this.state.editProfile ? (
          <ContactProfileForm contact={contact} onChange={onChange} />
        ) : contact.pi && !editMode && (
          <MultidimensionalPi className="m-contact-profile__pi" pi={contact.pi} />
        )
        }
      </div>
    );
  }
}

export default ContactProfile;
