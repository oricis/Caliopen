import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { withTranslator } from '@gandi/react-translate';
import Button from '../Button';
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
        <div className="m-contact-profile__avatar">
          <ContactAvatarLetter contact={contact} size="xlarge" />
        </div>
        <h3 className="m-contact-profile__title">{contact.title}</h3>
        {
          this.state.editMode && (
            <ContactProfileForm contact={contact} onChange={onChange} />
          )
        }
      </div>
    );
  }
}

export default ContactProfile;
