import React, { Component, PropTypes } from 'react';
import { FormGrid, FormRow, FormColumn, TextFieldGroup, FieldErrors } from '../form';
import Button from '../Button';
import Title from '../Title';

import './style.scss';

function generateStateFromProps(props) {
  return {
    ...props.formValues,
  };
}

class LoginForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    form: PropTypes.shape({}),
    formValues: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  render() {
    const { errors = {}, form } = this.props;

    return (
      <div className="s-login">
        <FormGrid className="s-login__form" {...form}>
          { errors.global && (
            <FormColumn bottomSpace>
              <FormRow>
                <FieldErrors errors={errors.global} />
              </FormRow>
            </FormColumn>
          )}
          <FormRow>
            <FormColumn className="s-login__title" bottomSpace>
              <Title>Please Log In</Title>
            </FormColumn>
            <FormColumn bottomSpace>
              <TextFieldGroup
                label="Username"
                placeholder="Username"
                name="username"
                value={this.state.username}
                errors={errors.username}
                showLabelforSr
              />
            </FormColumn>
            <FormColumn bottomSpace>
              <TextFieldGroup
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                value={this.state.password} errors={errors.password}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn className="m-im-form__action">
              <Button type="submit" expanded plain>Login</Button>
            </FormColumn>
          </FormRow>
        </FormGrid>
      </div>
    );
  }
}

export default LoginForm;
