import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGrid, FormRow, FormColumn, TextFieldGroup, FieldErrors } from '../form';
import Button from '../Button';
import Link from '../Link';
import Title from '../Title';

import './style.scss';

function generateStateFromProps(props) {
  return {
    ...props.formValues,
  };
}

class SigninForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    form: PropTypes.shape({}),
    onSubmit: PropTypes.func,
    __: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        username: '',
        password: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: value,
      },
    }));
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  }

  render() {
    const { errors = {}, form, __ } = this.props;

    return (
      <div className="s-signin">
        <FormGrid method="post" className="s-signin__form" {...form}>
          { errors.global && (
            <FormColumn bottomSpace>
              <FormRow>
                <FieldErrors errors={errors.global} />
              </FormRow>
            </FormColumn>
          )}
          <FormRow>
            <FormColumn className="s-signin__title" bottomSpace>
              <Title>{__('signin.title')}</Title>
            </FormColumn>
            <FormColumn bottomSpace>
              <TextFieldGroup
                id="signin_username"
                label={__('signin.form.username.label')}
                placeholder={__('signin.form.username.placeholder')}
                name="username"
                value={this.state.username}
                errors={errors.username}
                onChange={this.handleInputChange}
                showLabelforSr
              />
            </FormColumn>
            <FormColumn bottomSpace>
              <TextFieldGroup
                id="signin_password"
                label={__('signin.form.password.label')}
                placeholder={__('signin.form.password.placeholder')}
                name="password"
                type="password"
                value={this.state.password}
                errors={errors.password}
                onChange={this.handleInputChange}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn className="m-im-form__action" bottomSpace>
              <Button
                type="submit"
                onClick={this.handleSubmit}
                display="expanded"
                shape="plain"
              >{__('signin.action.login')}</Button>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Link to="/auth/signup">{__('signin.create_an_account')}</Link>
            </FormColumn>
          </FormRow>
        </FormGrid>
      </div>
    );
  }
}

export default SigninForm;
