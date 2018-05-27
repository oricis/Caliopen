import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Section, PageTitle, Button, Confirm, TextFieldGroup } from '../../components/';
import ProfileForm from './components/ProfileForm';
import ProfileInfo from './components/ProfileInfo';
import { signout } from '../../modules/routing';

import './style.scss';

class UserProfile extends Component {
  static propTypes = {
    requestUser: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    notifyError: PropTypes.func.isRequired,
    notifySuccess: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}),
    onDeleteUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: undefined,
  };

  state = {
    editMode: false,
    password: undefined,
    errorDeleteAccount: undefined,
  }

  componentDidMount() {
    this.props.requestUser();
  }

  handleSubmit = (ev) => {
    const { handleSubmit } = this.props;
    handleSubmit(ev)
      .then(this.handleSuccess, this.handleError);
  }

  handleSuccess = async () => {
    await this.props.requestUser();

    return this.toggleEditMode();
  }

  handleError = () => {
    const { i18n, notifyError } = this.props;
    notifyError({ message: i18n._('contact.feedback.unable_to_save', { defaults: 'Unable to save the contact' }) });
  }

  handlePasswordChange = (ev) => {
    this.setState({ password: ev.target.value, errorDeleteAccount: undefined });
  };

  handleDeleteAccount = async () => {
    try {
      await this.props.onDeleteUser({ password: this.state.password });
      this.props.notifySuccess({ message: 'Your account have been deleted' });
      signout();
    } catch (error) {
      this.setState({ errorDeleteAccount: error });
    }
  }

  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  }

  renderForm = () => {
    const { pristine, submitting, i18n } = this.props;

    return (
      <form method="post" name="user-profile" onSubmit={this.handleSubmit}>
        <ProfileForm editMode={this.state.editMode} />
        <div className="s-user-profile__actions">
          {!this.state.editMode ? (
            <Button onClick={this.toggleEditMode} shape="plain">
              <Trans id="user.action.edit_profile">Edit</Trans>
            </Button>
          ) : (
            <div>
              <Button type="submit" shape="plain" disabled={submitting || pristine}>
                <Trans id="user.action.update">Update</Trans>
              </Button>
              {' '}
              <Button onClick={this.toggleEditMode} shape="hollow">
                <Trans id="user.action.cancel_edit">Cancel</Trans>
              </Button>
            </div>
          )}
          <Confirm
            className="s-user-profile__delete"
            render={confirm => (
              <Button shape="plain" onClick={confirm} color="alert" >
                <Trans id="user.action.delete">Delete account</Trans>
              </Button>
            )}
            content={(
              <div className="s-user-profile__modal-delete-form">
                <h2>
                  <Trans id="user.action.delete.modal.title">Are you sure to delete your Caliopen account ?</Trans>
                </h2>
                <TextFieldGroup
                  id="confirm_password"
                  label={i18n._('signin.form.password.label', { defaults: 'Password' })}
                  placeholder={i18n._('signin.form.password.placeholder', { defaults: 'password' })}
                  name="password"
                  type="password"
                  value={this.state.password}
                  errors={this.state.errorDeleteAccount}
                  onChange={this.handlePasswordChange}
                  inputRef={(input) => { this.passwordInputRef = input; }}
                />
              </div>
            )}
            confirmButtonContent={(
              <Trans id="user.action.delete.button">Delete my Caliopen account</Trans>
            )}
            onConfirm={this.handleDeleteAccount}
          />
        </div>
      </form>
    );
  }

  render() {
    const { user, i18n } = this.props;

    return (
      <div className="s-user-profile">
        <PageTitle />
        <div className="s-user-profile__info">
          <ProfileInfo user={user} />
        </div>
        <Section className="s-user-profile__details" title={i18n._('user.profile.form.title', { defaults: 'Complete your profile' })}>
          {this.renderForm()}
        </Section>
      </div>
    );
  }
}

export default UserProfile;
