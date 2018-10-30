import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withI18n, Trans } from '@lingui/react';
import renderReduxField from '../../../../services/renderReduxField';
import { Button, FieldErrors, Fieldset, FormColumn, FormGrid, FormRow, Icon, Legend, TextFieldGroup as TextFieldGroupBase, TextareaFieldGroup as TextareaFieldGroupBase } from '../../../../components';

const TextFieldGroup = renderReduxField(TextFieldGroupBase);
const TextareaFieldGroup = renderReduxField(TextareaFieldGroupBase);

@withI18n()
class PublicKeyForm extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    i18n: PropTypes.shape({}).isRequired,
    contactId: PropTypes.string.isRequired,
    publicKey: PropTypes.shape({}),
    handleSubmit: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired,
    createPublicKey: PropTypes.func.isRequired,
  };

  static defaultProps = {
    publicKey: undefined,
    errors: [],
  };

  handleSubmit = (ev) => {
    const { contactId, handleSubmit, createPublicKey } = this.props;
    this.setState({ isSaving: true });
    handleSubmit(ev)
      .then(publicKey => createPublicKey({ contactId, publicKey }));
  };
  handleDelete = () => {};

  render() {
    const { form, errors, i18n } = this.props;

    return (
      <form onSubmit={this.handleSubmit} method="post">
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
                  label={i18n._('contact.public_key_form.key.label', null, { defaults: 'Key (ascii armored)' })}
                  name="key"
                  required
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <Button type="submit">Ajouter la clef</Button>
                <Button type="button" onClick={this.handleDelete}>Supprimer la clef</Button>
              </FormColumn>
            </FormRow>
          </Fieldset>
        </FormGrid>
      </form>
    );
  }
}

export default PublicKeyForm;
