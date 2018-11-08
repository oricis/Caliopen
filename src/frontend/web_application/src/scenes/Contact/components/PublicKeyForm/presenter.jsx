import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withI18n, Trans } from '@lingui/react';
import renderReduxField from '../../../../services/renderReduxField';
import { Button, FieldErrors, Fieldset, FormColumn, FormGrid, FormRow, Icon, Legend, TextFieldGroup as TextFieldGroupBase, TextareaFieldGroup as TextareaFieldGroupBase } from '../../../../components';

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
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    publicKey: undefined,
    errors: [],
  };

  static getDerivedStateFromProps(props) {
    return { mode: props.publicKey === undefined ? 'add' : 'edit' };
  }

  handleSubmit = (ev) => {
    const { contactId, handleSubmit, savePublicKey } = this.props;

    handleSubmit(ev)
      .then(publicKey => savePublicKey({ contactId, publicKey }));
  };

  handleDelete = () => {
    const {
      contactId, publicKey, deletePublicKey, onDelete,
    } = this.props;

    deletePublicKey({ contactId, publicKeyId: publicKey.key_id });

    if (onDelete) {
      onDelete();
    }
  };

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
                  required={this.state.mode === 'add'}
                  disabled={this.state.mode === 'edit'}
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
