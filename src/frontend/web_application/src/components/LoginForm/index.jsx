import React, { Component, PropTypes } from 'react';
import { FormGrid, FormRow, FormColumn, TextFieldGroup, FieldErrors } from '../form';
import Button from '../Button';

class LoginForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    form: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    const { errors = {}, form } = this.props;

    return (
      <FormGrid {...form}>
        { errors.global && (
          <FormRow>
            <FieldErrors errors={errors.global} />
          </FormRow>
        )}
        <FormRow>
          <FormColumn>
            <TextFieldGroup
              label="Login"
              name="login"
              value={this.state.username}
              errors={errors.login}
            />
          </FormColumn>
          <FormColumn>
            <TextFieldGroup
              label="Password"
              name="password"
              type="password"
              value={this.state.password} errors={errors.password}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <Button type="submit" plain>Login</Button>
        </FormRow>
      </FormGrid>
    );
  }
}

export default LoginForm;
