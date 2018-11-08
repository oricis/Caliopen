import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withI18n, Trans } from '@lingui/react';
import renderReduxField from '../../../../services/renderReduxField';
import { Button, Confirm, FieldErrors, Fieldset, FormColumn, FormGrid, FormRow, Icon, Legend, TextFieldGroup as TextFieldGroupBase, TextareaFieldGroup as TextareaFieldGroupBase } from '../../../../components';

import './style.scss';

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
    savePublicKey: PropTypes.func.isRequired,
    deletePublicKey: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    publicKey: undefined,
    onSuccess: undefined,
    onCancel: undefined,
    errors: [],
  };

  handleSubmit = (ev) => {
    const {
      contactId, handleSubmit, publicKey: { label }, savePublicKey,
    } = this.props;

    handleSubmit(ev)
      .then(publicKey => savePublicKey({ contactId, publicKey, original: { label } }));
  };

  handleDelete = () => {
    const {
      contactId, publicKey, deletePublicKey, onSuccess,
    } = this.props;

    deletePublicKey({ contactId, publicKeyId: publicKey.key_id });
    if (onSuccess) {
      onSuccess();
    }
  };

  render() {
    const {
      form, errors, i18n, publicKey, onCancel,
    } = this.props;

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
                  required={publicKey === undefined}
                  disabled={publicKey !== undefined}
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <Button type="submit" icon="key">Ajouter la clef</Button>
                {onCancel ? <Button icon="remove" onClick={onCancel}>Annuler</Button> : null}
                {publicKey ?
                  <Confirm
                    onConfirm={this.handleDelete}
                    title={i18n._(
                      'contact.public_key_form.confirm_delete.title',
                      null,
                      { defaults: 'Delete public key' }
                    )}
                    content={i18n._(
                      'contact.public_key_form.confirm_delete.content',
                      { label: publicKey.label, fingerprint: publicKey.fingerprint },
                      { defaults: 'Are you sure you want to delete the key "{label} - {fingerprint}" ? This action cannot be undone.' }
                    )}
                    render={confirm =>
                      <Button type="button" color="alert" icon="remove" onClick={confirm}>Supprimer la clef</Button>}
                  /> : null}
              </FormColumn>
            </FormRow>
          </Fieldset>
        </FormGrid>
      </form>
    );
  }
}

export default PublicKeyForm;
