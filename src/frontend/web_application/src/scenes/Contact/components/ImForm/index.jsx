import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Trans, withI18n } from 'lingui-react';
import renderReduxField from '../../../../services/renderReduxField';
import { Button, Icon, FieldErrors, SelectFieldGroup as SelectFieldGroupBase, TextFieldGroup as TextFieldGroupBase, Fieldset, Legend, FormGrid, FormRow, FormColumn } from '../../../../components';
import './style.scss';

const IM_TYPES = ['', 'work', 'home', 'other', 'netmeeting'];
const TextFieldGroup = renderReduxField(TextFieldGroupBase);
const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

@withI18n()
class ImForm extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    errors: [],
  };

  componentWillMount() {
    this.initTranslations();
  }

  initTranslations() {
    const { i18n } = this.props;

    this.addressTypes = {
      work: i18n._('contact.im_type.work', { defaults: 'Work' }),
      home: i18n._('contact.im_type.home', { defaults: 'Home' }),
      other: i18n._('contact.im_type.other', { defaults: 'Other' }),
      netmeeting: i18n._('contact.im_type.netmeeting', { defaults: 'Netmeeting' }),
    };
  }

  render() {
    const { i18n, errors = [], onDelete } = this.props;
    const addressTypeOptions = IM_TYPES.map(value => ({
      value,
      label: this.addressTypes[value] || '',
    }));

    return (
      <FormGrid className="m-im-form">
        <Fieldset>
          <FormRow>
            <FormColumn size="shrink">
              <Legend>
                <Icon type="comment" rightSpaced />
                <span className="m-im-form__legend"><Trans id="contact.im_form.legend">Instant messaging</Trans></span>
              </Legend>
            </FormColumn>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="shrink" bottomSpace>
              <Field
                component={SelectFieldGroup}
                name="type"
                label={i18n._('contact.im_form.type.label', { defaults: 'Type' })}
                showLabelforSr
                options={addressTypeOptions}
              />
            </FormColumn>
            <FormColumn size="medium" fluid bottomSpace>
              <Field
                component={TextFieldGroup}
                name="address"
                type="email"
                label={i18n._('contact.im_form.address.label', { defaults: 'Address' })}
                showLabelforSr
                required
              />
            </FormColumn>
            <FormColumn className="m-im-form__col-button">
              <Button color="alert" icon="remove" onClick={onDelete} />
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default ImForm;
