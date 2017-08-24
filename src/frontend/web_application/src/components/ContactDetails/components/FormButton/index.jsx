import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';

import './style.scss';

class FormButton extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    obj: PropTypes.shape({}).isRequired,
  };

  state = {
    isActive: false,
  }

  toogleForm = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive,
    }));
  }

  renderButton = () => {
    const { __ } = this.props;
    const buttonProps = {
      icon: this.state.isActive ? 'remove' : 'plus',
    };

    return (
      <Button
        {...buttonProps}
        onClick={this.toogleForm}
      >{this.state.isActive ? __('contact.action.cancel_new_field') : __('contact.action.add_new_field')}</Button>
    );
  }

  render() {
    const { obj } = this.props;

    return (
      <div className="m-new-form-button">
        {this.state.isActive && <div className="m-new-form-button__form">{obj}</div>}
        {this.renderButton()}
      </div>
    );
  }
}

export default FormButton;
