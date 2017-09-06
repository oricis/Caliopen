import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import { PasswordStrength } from '../../../../components/form';
import PasswordForm from '../PasswordForm';
import TextBlock from '../../../../components/TextBlock';
import './style.scss';

class PasswordDetails extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    user: PropTypes.shape({}).isRequired,
    // updateContact: PropTypes.func,
  };

  static defaultProps = {
    onUpdateContact: str => str,
  }

  state = {
    editMode: false,
  }

  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  }

  render() {
    const { __, user } = this.props;

    return (
      <div className="m-password-details">
        {!this.state.editMode &&
          <TextBlock className="m-password-details__title">Password strength</TextBlock>
        }
        {this.state.editMode ?
          // FIXME: PasswordForm should have its own route to be displayed in new tab
          <div className="m-password-details__form">
            <PasswordForm __={__} user={user} onCancel={this.toggleEditMode} />
          </div>
        :
          <PasswordStrength
            className="m-password-details__strength"
            strength={user.privacy_features.password_strength}
          />
        }
        {!this.state.editMode &&
          // FIXME: button should be a link to PasswordForm route (new tab)
          <div className="m-password-details__action">
            <Button onClick={this.toggleEditMode}>Change</Button>
          </div>
        }
      </div>
    );
  }
}

export default PasswordDetails;
