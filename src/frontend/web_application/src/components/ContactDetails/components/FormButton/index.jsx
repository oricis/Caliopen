import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';

import './style.scss';

class FormButton extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    isActive: false,
  }

  toggleForm = () => {
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
        onClick={this.toggleForm}
      >{this.state.isActive ? __('contact.action.cancel_new_field') : __('contact.action.add_new_field')}</Button>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <div className="m-new-form-button">
        {this.state.isActive && <div className="m-new-form-button__form">{children}</div>}
        {this.renderButton()}
      </div>
    );
  }
}

export default FormButton;
