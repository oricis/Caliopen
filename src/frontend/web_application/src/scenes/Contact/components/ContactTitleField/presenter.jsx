import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextFieldGroup } from '../../../../components/form';
import { formatName } from '../../../../services/contact';


class ContactTitleField extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    contact: PropTypes.shape({}).isRequired,
    contact_display_format: PropTypes.string.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { i18n, contact, contact_display_format: format, className } = this.props;

    return (
      <TextFieldGroup
        className={className}
        label={i18n.t`contact_profile.form.title.label`}
        placeholder={i18n.t`contact_profile.form.title.label`}
        defaultValue={formatName({ contact, format })}
        disabled
        showLabelforSr
      />
    );
  }
}

export default ContactTitleField;
