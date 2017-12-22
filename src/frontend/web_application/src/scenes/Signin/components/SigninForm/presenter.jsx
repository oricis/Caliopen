import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { FormGrid, FormRow, FormColumn, TextFieldGroup, FieldErrors } from '../../../../components/form';
import Button from '../../../../components/Button';
import Section from '../../../../components/Section';
import Link from '../../../../components/Link';

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
    onSubmit: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    errors: {},
    form: {},
  };

  state = {
    formValues: {
      username: '',
      password: '',
    },
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentDidMount() {
    setTimeout(this.setValues(), 1);
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  setValues = () => {
    const password = this.passwordInputRef.value;
    const username = this.usernameInputRef.value;
    this.setState({
      formValues: {
        password,
        username,
      },
    });
  }

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
    const { errors = {}, form, i18n } = this.props;

    return (
      <Section className="s-signin" title={i18n._('signin.title')}>
        <FormGrid className="s-signin__form">
          <form method="post" {...form}>
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace>
                <div className="s-signin__alpha" dangerouslySetInnerHTML={{ __html: i18n._('signup.limited_registration') }} />
              </FormColumn>
            </FormRow>
            { errors.global && (
              <FormRow>
                <FormColumn rightSpace={false} bottomSpace>
                  <FieldErrors errors={errors.global} />
                </FormColumn>
              </FormRow>
            )}
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace>
                <TextFieldGroup
                  id="signin_username"
                  label={i18n._('signin.form.username.label')}
                  placeholder={i18n._('signin.form.username.placeholder')}
                  name="username"
                  value={this.state.username}
                  errors={errors.username}
                  onChange={this.handleInputChange}
                  showLabelforSr
                  inputRef={(input) => { this.usernameInputRef = input; }}
                />
              </FormColumn>
              <FormColumn rightSpace={false} bottomSpace>
                <TextFieldGroup
                  id="signin_password"
                  label={i18n._('signin.form.password.label')}
                  placeholder={i18n._('signin.form.password.placeholder')}
                  name="password"
                  type="password"
                  value={this.state.password}
                  errors={errors.password}
                  onChange={this.handleInputChange}
                  showLabelforSr
                  inputRef={(input) => { this.passwordInputRef = input; }}
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn rightSpace={false} className="s-signin__action" bottomSpace>
                <Button
                  type="submit"
                  onClick={this.handleSubmit}
                  display="expanded"
                  shape="plain"
                ><Trans id="signin.action.login">Login</Trans></Button>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn rightSpace={false}>
                <Link to="/auth/forgot-password"><Trans id="signin.action.forgot_password">Forgot password?</Trans></Link>
              </FormColumn>
              {/* <FormColumn rightSpace={false}>
                <Link to="/auth/signup">
                  <Trans id="signin.create_an_account">Create an account</Trans>
                </Link>
              </FormColumn> */}
            </FormRow>
          </form>
        </FormGrid>
      </Section>
    );
  }
}

export default SigninForm;
