import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectFieldGroup } from '../../../form';

import './style.scss';

class FormSelector extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    formsOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  state = {
    selectedForm: null,
  }

  handleSelectChange = (ev) => {
    const { value } = ev.target;
    this.setState(prevState => ({
      ...prevState,
      selectedForm: value,
    }));
  }

  renderSelector = () => {
    const { __, formsOptions } = this.props;
    const typeOptions = formsOptions.map(option => ({
      value: option.name,
      label: option.name,
    }));

    return (
      <SelectFieldGroup
        name="selectedForm"
        className="m-form-selector__select"
        value=""
        onChange={this.handleSelectChange}
        label={__('contact.form-selector.add_new_field.label')}
        options={typeOptions}
      />
    );
  }

  renderNewForm = (form) => {
    const { formsOptions } = this.props;
    const newForm = formsOptions.map(option => option.name === form &&
      <div className="m-form-selector__form" key={option.name}>
        {option.obj}
      </div>
    );

    return newForm;
  }

  render() {
    return (
      <div className="m-form-selector">
        {this.renderNewForm(this.state.selectedForm)}
        {this.renderSelector()}
      </div>
    );
  }
}

export default FormSelector;
