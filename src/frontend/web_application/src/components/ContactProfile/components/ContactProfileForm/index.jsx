import React, { PropTypes, Component } from 'react';
import { withTranslator } from '@gandi/react-translate';
import Button from '../../../Button';
import { DatePickerGroup, TextFieldGroup } from '../../../form';
import './style.scss';

const generateStateFromProps = (props, prevState) => {
  const contactInfo = props.contact.info || {};

  return {
    contact: {
      ...prevState.contact,
      ...props.contact,
      infos: {
        ...prevState.contact.infos,
        ...contactInfo,
      },
    },
  };
};

class ContactProfileForm extends Component {
  static propTypes = {
    contact: PropTypes.shape({}),
    onChange: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    contact: {},
  };

  state = {
    contact: {
      title: '',
      name_prefix: '',
      given_name: '',
      family_name: '',
      name_suffix: '',
      infos: {
        birthday: '',
      },
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => generateStateFromProps(nextProps, prevState));
  }

  handleChanges = (event) => {
    this.setState({ contact: { ...this.state.contact, [event.target.name]: event.target.value } });
  }

  handleBirthdayChanges = (date) => {
    this.setState({
      contact: {
        ...this.state.contact,
        infos: {
          ...this.state.contact.infos,
          birthday: new Date(date),
        },
      },
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onChange({ contact: this.state.contact, original: this.props.contact });
  }

  render() {
    const { __ } = this.props;
    const fakeBirthday = new Date();

    return (
      <form
        className="m-contact-profile-form"
        onSubmit={this.handleSubmit}
      >
        <TextFieldGroup
          className="m-contact-profile-form__title"
          defaultValue={this.state.contact.title}
          label={__('contact_profile.form.title.label')}
          name="title"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__name-prefix"
          defaultValue={this.state.contact.name_prefix}
          label={__('contact_profile.form.name-prefix.label')}
          name="name_prefix"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__firstname"
          defaultValue={this.state.contact.given_name}
          label={__('contact_profile.form.firstname.label')}
          name="given_name"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__lastname"
          defaultValue={this.state.contact.family_name}
          label={__('contact_profile.form.lastname.label')}
          name="family_name"
          onChange={this.handleChanges}
        />
        <TextFieldGroup
          className="m-contact-profile-form__name-suffix"
          defaultValue={this.state.contact.name_suffix}
          label={__('contact_profile.form.name-suffix.label')}
          name="name_suffix"
          onChange={this.handleChanges}
        />

        <DatePickerGroup
          id="contact-form-birthday"
          className="m-contact-profile-form__birthday"
          label={__('contact_profile.form.birthday.label')}
          startDate={
            this.state.contact.infos.birthday ? this.state.contact.infos.birthday : fakeBirthday
          }
          onDateChange={this.handleBirthdayChanges}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
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
