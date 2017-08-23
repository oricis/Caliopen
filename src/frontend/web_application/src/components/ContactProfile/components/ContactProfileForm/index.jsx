import React, { PropTypes, Component } from 'react';
import { withTranslator } from '@gandi/react-translate';
import Button from '../../../Button';
import { DatePickerGroup, TextFieldGroup } from '../../../form';
import './style.scss';

const generateStateFromProps = (props, prevState) => {
  const contactInfo = props.contact.infos || {};

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
    isExpanded: false,
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => generateStateFromProps(nextProps, prevState));
  }

  handleChanges = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        [name]: value,
      },
    }));
  }

  handleBirthdayChanges = (date) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        infos: {
          ...prevState.contact.infos,
          birthday: date.format('YYYY-MM-DD'),
        },
      },
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onChange({ contact: this.state.contact, original: this.props.contact });
  }

  toggleExpandForm = () => {
    this.setState(prevState => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));
  }

  render() {
    const { __ } = this.props;

    return (
      <form
        className="m-contact-profile-form"
        onSubmit={this.handleSubmit}
      >
        <div className="m-contact-profile-form__header">
          <TextFieldGroup
            className="m-contact-profile-form__title"
            defaultValue={this.state.contact.title}
            label={__('contact_profile.form.title.label')}
            placeholder={__('contact_profile.form.title.label')}
            name="title"
            onChange={this.handleChanges}
            showLabelforSr
          />
          {this.state.isExpanded ?
            <Button
              icon="caret-up"
              display="inline"
              onClick={this.toggleExpandForm}
              className="m-contact-profile-form__expand-button"
            >
              <span className="show-for-sr">
                {__('contact_profile.action.edit_contact')}
              </span>
            </Button>
          :
            <Button
              icon="caret-down"
              display="inline"
              onClick={this.toggleExpandForm}
              className="m-contact-profile-form__expand-button"
            >
              <span className="show-for-sr">
                {__('contact_profile.action.edit_contact')}
              </span>
            </Button>
          }
        </div>

        {this.state.isExpanded &&
          <div className="m-contact-profile-form__expanded-form">
            <TextFieldGroup
              className="m-contact-profile-form__input"
              defaultValue={this.state.contact.name_prefix}
              label={__('contact_profile.form.name-prefix.label')}
              placeholder={__('contact_profile.form.name-prefix.label')}
              name="name_prefix"
              onChange={this.handleChanges}
              showLabelforSr
            />
            <TextFieldGroup
              className="m-contact-profile-form__input"
              defaultValue={this.state.contact.given_name}
              label={__('contact_profile.form.firstname.label')}
              placeholder={__('contact_profile.form.firstname.label')}
              name="given_name"
              onChange={this.handleChanges}
              showLabelforSr
            />
            <TextFieldGroup
              className="m-contact-profile-form__input"
              defaultValue={this.state.contact.family_name}
              label={__('contact_profile.form.lastname.label')}
              placeholder={__('contact_profile.form.lastname.label')}
              name="family_name"
              onChange={this.handleChanges}
              showLabelforSr
            />
            <TextFieldGroup
              className="m-contact-profile-form__input"
              defaultValue={this.state.contact.name_suffix}
              label={__('contact_profile.form.name-suffix.label')}
              placeholder={__('contact_profile.form.name-suffix.label')}
              name="name_suffix"
              onChange={this.handleChanges}
              showLabelforSr
            />
          </div>
        }

        {
          // TODO:
          // prevent selecting dates after today
          // see https://github.com/Hacker0x01/react-datepicker
        }
        <DatePickerGroup
          id="contact-form-birthday"
          className="m-contact-profile-form__birthday"
          inputClassName="m-contact-profile-form__birthday-input"
          label={__('contact_profile.form.birthday.label')}
          onDateChange={this.handleBirthdayChanges}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          selected={this.state.contact.infos.birthday ?
            this.state.contact.infos.birthday : null}
        />

        <div className="m-contact-profile-form__save-button-wrapper">
          <Button
            type="submit"
            className="m-contact-profile-form__save-button"
            display="expanded"
            shape="plain"
            icon="check"
          >{__('contact_profile.action.save')}</Button>
        </div>
      </form>
    );
  }
}


export default withTranslator()(ContactProfileForm);
