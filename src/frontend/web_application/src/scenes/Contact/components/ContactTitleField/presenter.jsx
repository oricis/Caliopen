import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextFieldGroup } from '../../../../components/form';
import { formatName } from '../../../../services/contact';


class ContactTitleField extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
    contact: PropTypes.shape({}).isRequired,
    contact_display_format: PropTypes.string.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { __, contact, contact_display_format: format, className } = this.props;

    return (
      <TextFieldGroup
        className={className}
        label={__('contact_profile.form.title.label')}
        placeholder={__('contact_profile.form.title.label')}
        defaultValue={formatName({ contact, format })}
        disabled
        showLabelforSr
      />
    );
  }
}

export default ContactTitleField;
