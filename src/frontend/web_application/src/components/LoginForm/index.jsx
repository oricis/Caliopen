import React, { Component, PropTypes } from 'react';
import { FormGrid, FormRow, FormColumn, TextFieldGroup, FieldErrors } from '../form';
import Button from '../Button';

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
      <FormGrid {...form}>
        { errors.global && (
          <FormRow>
            <FieldErrors errors={errors.global} />
          </FormRow>
        )}
        <FormRow>
          <FormColumn>
            <TextFieldGroup
              label="Username"
              name="username"
              value={this.state.username}
              errors={errors.username}
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
