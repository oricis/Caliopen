import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Button from '../../../../components/Button';
import Link from '../../../../components/Link';
import Section from '../../../../components/Section';
import Modal from '../../../../components/Modal';
import TextBlock from '../../../../components/TextBlock';

import { TextFieldGroup, FormGrid, FormRow, FormColumn, PasswordStrength, CheckboxFieldGroup, FieldErrors } from '../../../../components/form';
import './style.scss';

function generateStateFromProps(props) {
  return {
    ...props.formValues,
  };
}

const noop = () => {};

class SignupForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    form: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    onUsernameChange: PropTypes.func,
    onUsernameBlur: PropTypes.func,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    errors: {},
    form: {},
    onUsernameChange: noop,
    onUsernameBlur: noop,
  }

  state = {
    isModalOpen: false,
    formValues: {
      username: '',
      password: '',
      tos: false,
      privacy: false,
      recovery_email: '',
    },
    passwordStrength: '',
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentDidMount() {
    import(/* webpackChunkName: "zxcvbn" */ 'zxcvbn').then((zxcvbn) => {
      this.zxcvbn = zxcvbn;
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  handleOpenModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  handleUsernameChange = (event) => {
    this.handleInputChange(event);

    this.props.onUsernameChange(event);
  };

  handlePasswordChange = (event) => {
    this.handleInputChange(event);
    this.calcPasswordStrengh();
  }

  calcPasswordStrengh = () => {
    if (this.zxcvbn) {
      this.setState((prevState) => {
        const { password } = prevState.formValues;
        const passwordStrength = !password.length ? '' : this.zxcvbn(password).score;

        return {
          ...prevState,
          passwordStrength,
        };
      });
    }
  }


  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: value,
      },
    }));
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: checked,
      },
    }));
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  };

  renderModal = () => {
    const { i18n } = this.props;

    return (
      <Modal
        className="s-signup__modal"
        isOpen={this.state.isModalOpen}
        contentLabel={i18n.t`signup.privacy.modal.label`}
        title={i18n.t`signup.privacy.modal.label`}
        onClose={this.handleCloseModal}
      >
        <p><Trans id="signup.privacy.modal.title">signup.privacy.modal.title</Trans></p>
        <p><Trans id="signup.privacy.modal.text.alpha_tester">signup.privacy.modal.text.alpha_tester</Trans></p>
        <p><Trans id="signup.privacy.modal.text.get_data">signup.privacy.modal.text.get_data</Trans></p>
        <p><Trans id="signup.privacy.modal.text.desactivate_dnt">signup.privacy.modal.text.desactivate_dnt</Trans></p>
        <p><Trans id="signup.privacy.modal.text.piwik">signup.privacy.modal.text.piwik</Trans></p>
        <Button
          shape="plain"
          onClick={this.handleCloseModal}
        >
          <Trans id="signup.privacy.modal.close">signup.privacy.modal.close</Trans>
        </Button>
      </Modal>
    );
  }

  render() {
    const { form, errors = {}, i18n } = this.props;

    return (
      <Section className="s-signup" title={i18n.t`signup.title`}>
        <FormGrid className="s-signup__form">
          <form method="post" name="ac_form" {...form}>
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace>
                <div className="s-signup__alpha" dangerouslySetInnerHTML={{ __html: i18n.t`signup.limited_registration` }} />
              </FormColumn>
            </FormRow>
            {errors.global && errors.global.length !== 0 && (
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace>
                <FieldErrors className="s-signup__global-errors" errors={errors.global} />
              </FormColumn>
            </FormRow>
            )}
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace >
                <TextFieldGroup
                  id="signup_username"
                  name="username"
                  label={i18n.t`signup.form.username.label`}
                  placeholder={i18n.t`signup.form.username.placeholder`}
                  value={this.state.formValues.username}
                  errors={errors.username}
                  onChange={this.handleUsernameChange}
                  onBlur={this.props.onUsernameBlur}
                  showLabelforSr
                />
                <TextBlock className="s-signup__user">
                  <span className="s-signup__username">{this.state.formValues.username}</span>@alpha.caliopen.org
                </TextBlock>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace>
                <TextFieldGroup
                  id="signup_password"
                  name="password"
                  label={i18n.t`signup.form.password.label`}
                  placeholder={i18n.t`signup.form.password.placeholder`}
                  showLabelforSr
                  type="password"
                  value={this.state.formValues.password}
                  errors={errors.password}
                  onChange={this.handlePasswordChange}
                />
              </FormColumn>
              {this.state.passwordStrength.length !== 0 && (
              <FormColumn rightSpace={false} bottomSpace>
                <PasswordStrength strength={this.state.passwordStrength} />
              </FormColumn>
              )}
            </FormRow>
            <FormRow>
              <FormColumn rightSpace={false} bottomSpace >
                <TextFieldGroup
                  id="signup_recovery_email"
                  name="recovery_email"
                  // Alpha: label "recovery email" replaced by "invitation email"
                  // label={i18n.t`signup.form.recovery_email.label`}
                  // placeholder={i18n.t`signup.form.recovery_email.placeholder`}
                  label={i18n.t`signup.form.invitation_email.label`}
                  placeholder={i18n.t`signup.form.invitation_email.placeholder`}
                  value={this.state.formValues.recovery_email}
                  errors={errors.recovery_email}
                  onChange={this.handleInputChange}
                  showLabelforSr
                />
                <span><Trans id="signup.form.invitation_email.label">signup.form.invitation_email.label</Trans></span>
              </FormColumn>
            </FormRow>
            {/* Alpha: hide TOS checkbox
              <FormRow>
                <FormColumn rightSpace={false} bottomSpace>
                  <CheckboxFieldGroup
                    id="signup_tos"
                    className="s-signup__tos-checkbox"
                    label={i18n.t`signup.form.tos.label`}
                    name="tos"
                    checked={this.state.formValues.tos}
                    errors={errors.tos}
                    onChange={this.handleCheckboxChange}
                  />
                </FormColumn>
              </FormRow>
              */}
            <FormRow>
              <FormColumn rightSpace={false} className="s-signup__privacy" bottomSpace>
                <h4><Trans id="signup.form.privacy.title">signup.form.privacy.title</Trans></h4>
                <p className="s-signup__privacy-text">
                  <Trans id="signup.form.privacy.intro">signup.form.privacy.intro</Trans>
                </p>
                <Button
                  className="s-signup__privacy-link"
                  onClick={this.handleOpenModal}
                  icon="question-circle"
                ><Trans id="signup.form.privacy.more_info">signup.form.privacy.more_info</Trans></Button>
                {this.renderModal()}
                <CheckboxFieldGroup
                  id="signup_privacy"
                  className="s-signup__privacy-checkbox"
                  label={i18n.t`signup.form.privacy.checkbox.label`}
                  name="privacy"
                  checked={this.state.formValues.privacy}
                  errors={errors.privacy}
                  onChange={this.handleCheckboxChange}
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn rightSpace={false} className="s-signup__action" bottomSpace>
                <Button
                  type="submit"
                  onClick={this.handleSubmit}
                  display="expanded"
                  shape="plain"
                ><Trans id="signup.action.create">signup.action.create</Trans></Button>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn rightSpace={false}>
                <Link to="/auth/signin"><Trans id="signup.go_signin">signup.go_signin</Trans></Link>
              </FormColumn>
            </FormRow>
          </form>
        </FormGrid>
      </Section>
    );
  }
}

export default SignupForm;
