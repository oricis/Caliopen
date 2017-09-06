import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import TextBlock from '../../../../components/TextBlock';
import { TextFieldGroup } from '../../../../components/form';
import './style.scss';

class LoginDetails extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    user: PropTypes.shape({}).isRequired,
  };

  state = {
    editMode: false,
  }

  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  }

  render() {
    const { __, user } = this.props;

    return (
      <div className="m-login-details">
        <TextBlock className="m-login-details__title">Login</TextBlock>
        <TextFieldGroup
          className="m-login-details__input"
          value={user.username}
          label={__('Login')}
          showLabelforSr
          disabled
        />
        <div className="m-login-details__action">
          <Button onClick={this.toggleEditMode}>{__('Change')}</Button>
        </div>
      </div>
    );
  }
}

export default LoginDetails;
