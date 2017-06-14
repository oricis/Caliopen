import React, { PropTypes, Component } from 'react';
import { withTranslator } from '@gandi/react-translate';
import Button from '../../../Button';
import { TextFieldGroup } from '../../../form';
import './style.scss';

class ContactProfileForm extends Component {
  static propTypes = {
    contact: PropTypes.shape({}),
    onChange: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    contact: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      contact: props.contact,
    };

    this.handleChanges = this.handleChanges.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChanges(event) {
    this.setState({ contact: { ...this.state.contact, [event.target.name]: event.target.value } });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onChange(this.state.contact);
  }

  render() {
    const { __ } = this.props;
    const contact = this.state.contact;

    return (
      <form
        className="m-contact-profile-form"
        onSubmit={this.handleSubmit}
      >
        <TextFieldGroup
          className="m-contact-profile-form__title"
          value={contact.title}
          label={__('contact_profile.form.title.label')}
          name="title"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__name-prefix"
          value={contact.name_prefix ? contact.name_prefix : ''}
          label={__('contact_profile.form.name-prefix.label')}
          name="name_prefix"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__firstname"
          value={contact.given_name}
          label={__('contact_profile.form.firstname.label')}
          name="given_name"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__lastname"
          value={contact.family_name}
          label={__('contact_profile.form.lastname.label')}
          name="family_name"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__name-suffix"
          value={contact.name_suffix ? contact.name_suffix : ''}
          label={__('contact_profile.form.name-suffix.label')}
          name="name_suffix"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__birthday"
          value={contact.infos.birthday ? contact.infos.birthday : ''}
          label={__('contact_profile.form.birthday.label')}
          name="name_suffix"
          onChange={this.handleChanges}
        />
        <div className="m-contact-profile-form__save-button">
          <div className="m-contact-profile-form__save-button-wrapper">
            <Button type="submit" display="expanded" shape="plain" icon="check">{__('contact_profile.action.save')}</Button>
          </div>
        </div>
      </form>
    );
  }
}


export default withTranslator()(ContactProfileForm);
