import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormRow, FormColumn, FieldErrors, TextFieldGroup } from '../form';
import Button from '../Button';
import './style.scss';

class PasswordResetForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: {},
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
    const { __, errors } = this.props;

    return (
      <form method="post" onSubmit={this.handleSubmit}>
        { errors.global && (
          <FormColumn bottomSpace>
            <FormRow>
              <FieldErrors errors={errors.global} />
            </FormRow>
          </FormColumn>
        )}
        <FormRow>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label={__('signin.form.username.label')}
              placeholder={__('signin.form.username.placeholder')}
              name="username"
              value={this.state.formValues.username}
              errors={errors.username}
              onChange={this.handleInputChange}
              showLabelforSr
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn className="m-password-reset-form__action" bottomSpace>
            <Button
              type="submit"
              display="expanded"
              shape="plain"
            >{__('Reset password')}</Button>
          </FormColumn>
        </FormRow>
      </form>
    );
  }
}

export default PasswordResetForm;
