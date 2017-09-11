import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Button from '../../../../components/Button';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase, FieldErrors } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

const DISPLAY_FORMATS = ['rich_text', 'plain_text'];

class PresentationForm extends PureComponent {
  static propTypes = {
    errors: PropTypes.shape({}),
    handleSubmit: PropTypes.func.isRequired,
    requestSettings: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  componentWillMount() {
    this.initTranslations();
  }

  getOptionsFromArray = options => options.map(value => ({
    value,
    label: this.i18n[value] || value,
  }));

  handleSubmit = (ev) => {
    const { handleSubmit, requestSettings } = this.props;

    return handleSubmit(ev).then(requestSettings);
  }

  initTranslations() {
    const { __ } = this.props;
    this.i18n = {
      rich_text: __('settings.presentation.display-format.options.rich_text'),
      plain_text: __('settings.presentation.display-format.options.plain_text'),
    };
  }

  render() {
    const { errors, __ } = this.props;

    const displayFormatOptions = this.getOptionsFromArray(DISPLAY_FORMATS);

    return (
      <FormGrid className="m-presentation-form">
        <form method="post" name="presentation_form" onSubmit={this.handleSubmit}>
          {errors.global && errors.global.length !== 0 && (
          <FormRow>
            <FormColumn bottomSpace>
              <FieldErrors errors={errors.global} />
            </FormColumn>
          </FormRow>
          )}
          <FormRow>
            <FormColumn size="shrink" bottomSpace >
              <Field
                component={SelectFieldGroup}
                name="message_display_format"
                label={__('settings.presentation.display-format.label')}
                options={displayFormatOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-presentation-form__action" bottomSpace>
              <Button type="submit" shape="plain">
                {__('settings.presentation.update.action')}
              </Button>
            </FormColumn>
          </FormRow>
        </form>
      </FormGrid>
    );
  }
}

export default PresentationForm;
