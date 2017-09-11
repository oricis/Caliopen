import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fieldset, Legend, FormGrid, FormRow, FormColumn, FieldErrors, TextFieldGroup } from '../form';
import Section from '../Section';
import Button from '../Button';
import Icon from '../Icon';
import Link from '../Link';

import './style.scss';

class PasswordResetForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    success: PropTypes.bool,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: {},
    success: false,
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
    const { __, errors, success } = this.props;

    return (
      <Section title={__('password.reset-form.title')} className="m-password-reset-form">
        <FormGrid className="m-password-reset-form">
          <form method="post" onSubmit={this.handleSubmit}>
            <Fieldset>
              {errors.global && (
                <FormRow>
                  <FormColumn size="full" bottomSpace>
                    <FieldErrors errors={errors.global} />
                  </FormColumn>
                </FormRow>
              )}
              {success ? (
                <FormRow>
                  <FormColumn size="full" bottomSpace className="s-signin__password-success">
                    <Icon type="check" rightSpaced />{__('password.reset-form.success')}
                  </FormColumn>
                  <FormColumn size="full" className="m-password-reset-form__action" bottomSpace>
                    <Link
                      button
                      plain
                      expanded
                      to="/auth/signin"
                    >{__('password.reset-form.action.login')}</Link>
                  </FormColumn>
                </FormRow>
              ) : (
                <FormRow>
                  <FormColumn size="full" bottomSpace>
                    <Legend>
                      {__('password.reset-form.instructions')}
                    </Legend>
                  </FormColumn>
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
                    >{__('password.reset-form.action.send')}</Button>
                  </FormColumn>
                  <FormColumn size="full">
                    <Link to="/auth/signin">{__('password.reset-form.cancel')}</Link>
                  </FormColumn>
                </FormRow>
              )}
            </Fieldset>
          </form>
        </FormGrid>
      </Section>
    );
  }
}

export default PasswordResetForm;
