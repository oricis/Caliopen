import React, { PropTypes, Component } from 'react';
import { withTranslator } from '@gandi/react-translate';
import { Field } from 'redux-form';
import renderReduxField from '../../services/renderReduxField';
import Button from '../../../../components/Button';
import { TextFieldGroup as TextFieldGroupBase } from '../../../../components/form';
// import { DatePickerGroup, TextFieldGroup } from '../../../form';
import './style.scss';

const TextFieldGroup = renderReduxField(TextFieldGroupBase);

class ContactProfileForm extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  state = {
    isExpanded: false,
  };

  // TODO: remove
  // handleBirthdayChanges = (date) => {
  //   this.setState(prevState => ({
  //     contact: {
  //       ...prevState.contact,
  //       infos: {
  //         ...prevState.contact.infos,
  //         birthday: date.format('YYYY-MM-DD'),
  //       },
  //     },
  //   }));
  // }

  toggleExpandForm = () => {
    this.setState(prevState => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const { __ } = this.props;

    return (
      <div className="m-contact-profile-form">
        <div className="m-contact-profile-form__header">
          <Field
            component={TextFieldGroup}
            className="m-contact-profile-form__title"
            label={__('contact_profile.form.title.label')}
            placeholder={__('contact_profile.form.title.label')}
            name="title"
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
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={__('contact_profile.form.name-prefix.label')}
              placeholder={__('contact_profile.form.name-prefix.label')}
              name="name_prefix"
              showLabelforSr
            />
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={__('contact_profile.form.firstname.label')}
              placeholder={__('contact_profile.form.firstname.label')}
              name="given_name"
              showLabelforSr
            />
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={__('contact_profile.form.lastname.label')}
              placeholder={__('contact_profile.form.lastname.label')}
              name="family_name"
              showLabelforSr
            />
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={__('contact_profile.form.name-suffix.label')}
              placeholder={__('contact_profile.form.name-suffix.label')}
              name="name_suffix"
              showLabelforSr
            />
          </div>
        }

        {
          // TODO:
          // This should be displayed in ContactDetails
          // prevent selecting dates after today
          // see https://github.com/Hacker0x01/react-datepicker
        }
        {/* <DatePickerGroup
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
        /> */}
      </div>
    );
  }
}


export default withTranslator()(ContactProfileForm);
