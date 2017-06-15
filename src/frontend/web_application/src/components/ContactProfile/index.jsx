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
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };

    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  render() {
    const { contact, className, onChange, __ } = this.props;
    const activeButtonProp = this.state.editMode ? { color: 'active' } : {};

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
            <Button
              icon="edit"
              {...activeButtonProp}
              onClick={this.toggleEditMode}
            >
              <span className="show-for-sr">
                {__('contact_profile.action.edit_contact')}
              </span>
            </Button>
          </div>

        </div>


        {contact.tags.length > 0 &&
          <div className="m-contact-profile__tags">
            {contact.tags.map(tag => (
              <Badge className="m-contact-profile__tag" key={tag}>{tag}</Badge>
            ))}
          </div>
        }
        {this.state.editMode ? (
          <ContactProfileForm contact={contact} onChange={onChange} />
        ) : (
          <MultidimensionalPi className="m-contact-profile__pi" pi={contact.privacy_index} />
        )
        }
      </div>
    );
  }
}

export default ContactProfile;
