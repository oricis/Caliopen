import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import { Field } from 'redux-form';
import renderReduxField from '../../../../services/renderReduxField';
import Icon from '../../../../components/Icon';
import Button from '../../../../components/Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup as TextFieldGroupBase, SelectFieldGroup as SelectFieldGroupBase, FormGrid, FormRow, FormColumn } from '../../../../components/form';

import './style.scss';

const IDENTITY_TYPES = ['', 'twitter', 'facebook'];
const TextFieldGroup = renderReduxField(TextFieldGroupBase);
const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

@withI18n()
class IdentityForm extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    errors: [],
  };

  render() {
    const { i18n, onDelete, errors } = this.props;
    const identityTypeOptions = IDENTITY_TYPES.map(value => ({
      value,
      label: value,
    }));

    return (
      <FormGrid className="m-identity-form">
        <Fieldset>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="shrink">
              <Legend>
                <Icon rightSpaced type="user" />
                <span className="m-identity-form__legend"><Trans id="contact.identity_form.legend">Identities</Trans></span>
              </Legend>
            </FormColumn>
            <FormColumn size="shrink" bottomSpace>
              <Field
                component={SelectFieldGroup}
                name="type"
                label={i18n._('contact.identity_form.service.label')}
                options={identityTypeOptions}
                showLabelforSr
                required
              />
            </FormColumn>
            <FormColumn size="medium" fluid bottomSpace>
              <Field
                component={TextFieldGroup}
                name="name"
                label={i18n._('contact.identity_form.identity.label')}
                showLabelforSr
                required
              />
            </FormColumn>
            <FormColumn className="m-identity-form__col-button">
              <Button color="alert" icon="remove" onClick={onDelete} />
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default IdentityForm;
