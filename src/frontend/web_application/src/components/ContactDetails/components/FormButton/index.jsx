import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';

class FormButton extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    obj: PropTypes.shape({}).isRequired,
  };

  state = {
    isActive: false,
  }

  handleButtonClick = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: true,
    }));
  }

  renderButton = () => {
    const { __ } = this.props;

    return (
      <Button
        icon="plus"
        onClick={this.handleButtonClick}
      >{__('add')}</Button>
    );
  }

  renderNewForm = () => {
    const { obj } = this.props;
    const newForm = (
      <div className="m-new-form-button__form">{obj}</div>
    );

    return newForm;
  }

  render() {
    return (
      <div className="m-new-form-button">
        {this.state.isActive ?
          this.renderNewForm()
        :
          this.renderButton()
        }
      </div>
    );
  }
}

export default FormButton;
