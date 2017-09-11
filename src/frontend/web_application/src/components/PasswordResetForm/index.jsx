import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fieldset, Legend, FormGrid, FormRow, FormColumn, FieldErrors, TextFieldGroup } from '../form';
import Button from '../Button';

import './style.scss';

class PasswordResetForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: {},
    cancel: str => str,
  };

  state = {
    formValues: {
      username: '',
    },
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: value,
      },
    }));
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  }

  render() {
    const { __, errors, cancel } = this.props;

    return (
      <FormGrid className="m-password-reset-form">
        <form method="post" onSubmit={this.handleSubmit}>
          <Fieldset>
            <FormRow>
              <FormColumn>
                <Legend size="full" bottomSpace>
                  {__('password.reset-form.instructions')}
                </Legend>
              </FormColumn>
            </FormRow>
            {errors.global && (
              <FormRow>
                <FormColumn size="full" bottomSpace>
                  <FieldErrors errors={errors.global} />
                </FormColumn>
              </FormRow>
            )}
            <FormRow>
              <FormColumn size="full" bottomSpace>
                <TextFieldGroup
                  label={__('password.reset-form.username.label')}
                  placeholder={__('password.reset-form.username.placeholder')}
                  name="username"
                  value={this.state.formValues.username}
                  errors={errors.username}
                  onChange={this.handleInputChange}
                  required
                  showLabelforSr
                />
              </FormColumn>
              <FormColumn size="full" className="m-password-reset-form__action" bottomSpace>
                <Button
                  type="submit"
                  display="expanded"
                  shape="plain"
                >{__('password.reset-form.action.reset')}</Button>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn size="full">
                <Button display="inline" onClick={cancel}>{__('back to login')}</Button>
              </FormColumn>
            </FormRow>
          </Fieldset>
        </form>
      </FormGrid>
    );
  }
}

export default PasswordResetForm;
