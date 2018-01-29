import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Field } from 'redux-form';
import ContactTitleField from '../ContactTitleField';
import renderReduxField from '../../../../services/renderReduxField';
import { Button, TextFieldGroup as TextFieldGroupBase } from '../../../../components/';
import './style.scss';

const TextFieldGroup = renderReduxField(TextFieldGroupBase);

class ContactProfileForm extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    form: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
  };

  static defaultProps = {
    isNew: false,
  };

  state = {
    isExpanded: false,
  };

  componentWillMount() {
    if (this.props.isNew) {
      this.setState({
        isExpanded: true,
      });
    }
  }

  toggleExpandForm = () => {
    this.setState(prevState => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const { i18n, form } = this.props;

    return (
      <div className="m-contact-profile-form">
        <div className="m-contact-profile-form__header">
          <ContactTitleField className="m-contact-profile-form__title" form={form} />
          {this.state.isExpanded ?
            <Button
              icon="caret-up"
              display="inline"
              onClick={this.toggleExpandForm}
              className="m-contact-profile-form__expand-button"
            >
              <span className="show-for-sr">
                <Trans id="contact_profile.action.edit_contact">Edit</Trans>
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
                <Trans id="contact_profile.action.edit_contact">Edit</Trans>
              </span>
            </Button>
          }
        </div>

        {this.state.isExpanded &&
          <div className="m-contact-profile-form__expanded-form">
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={i18n._('contact_profile.form.name-prefix.label', { defaults: 'Prefix' })}
              placeholder={i18n._('contact_profile.form.name-prefix.label', { defaults: 'Prefix' })}
              name="name_prefix"
              showLabelforSr
            />
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={i18n._('contact_profile.form.firstname.label', { defaults: 'Firstname' })}
              placeholder={i18n._('contact_profile.form.firstname.label', { defaults: 'Firstname' })}
              name="given_name"
              showLabelforSr
            />
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={i18n._('contact_profile.form.lastname.label', { defaults: 'Lastname' })}
              placeholder={i18n._('contact_profile.form.lastname.label', { defaults: 'Lastname' })}
              name="family_name"
              showLabelforSr
            />
            <Field
              component={TextFieldGroup}
              className="m-contact-profile-form__input"
              label={i18n._('contact_profile.form.name-suffix.label', { defaults: 'Suffix' })}
              placeholder={i18n._('contact_profile.form.name-suffix.label', { defaults: 'Suffix' })}
              name="name_suffix"
              showLabelforSr
            />
          </div>
        }
      </div>
    );
  }
}


export default ContactProfileForm;
