import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withI18n, Trans } from '@lingui/react';
import renderReduxField from '../../../../services/renderReduxField';
import { FieldErrors, Fieldset, FormColumn, FormGrid, FormRow, Icon, Legend, TextFieldGroup as TextFieldGroupBase, TextareaFieldGroup as TextareaFieldGroupBase } from '../../../../components';

const TextFieldGroup = renderReduxField(TextFieldGroupBase);
const TextareaFieldGroup = renderReduxField(TextareaFieldGroupBase);

@withI18n()
class PublicKeyForm extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    errors: [],
  };

  render() {
    const { errors, i18n } = this.props;

    return (
      <FormGrid className="m-public-key-form">
        <Fieldset>
          <FormRow>
            <FormColumn>
              <Legend>
                <Icon rightSpaced type="key" />
                <Trans id="contact.public_key_form.legend">Public Key</Trans>
              </Legend>
            </FormColumn>
            {errors.length > 0 && <FormColumn><FieldErrors errors={errors} /></FormColumn>}
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                component={TextFieldGroup}
                name="label"
                label={i18n._('contact.public_key_form.label.label', { defaults: 'Key label' })}
                required
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                component={TextareaFieldGroup}
                label="key"
                name="key"
                required
              />
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default PublicKeyForm;
