import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, FormGrid, FormRow, FormColumn, CheckboxFieldGroup } from '../../../form';

import './style.scss';

class OrgaForm extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: [],
  };

  state = {
    organization: {
      department: '',
      is_primary: false,
      job_description: '',
      label: '',
      name: '',
      title: '',
    },
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { organization } = this.state;
    this.props.onSubmit({ contactDetail: organization });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      organization: {
        ...prevState.organization,
        [name]: value,
      },
    }));
  }

  handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    this.setState(prevState => ({
      organization: {
        ...prevState.organization,
        [name]: checked,
      },
    }));
  }

  render() {
    const { __, errors } = this.props;

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-orga-form" name="orga_form">
        <Fieldset>
          <Legend>
            <Icon rightSpaced type="building" />
            {__('contact.orga_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn>
              <TextFieldGroup
                name="label"
                value={this.state.organization.label}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.label.label')}
                required
              />
            </FormColumn>
            <FormColumn>
              <TextFieldGroup
                name="name"
                value={this.state.organization.name}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.name.label')}
                required
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="title"
                value={this.state.organization.title}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.title.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="department"
                value={this.state.organization.department}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.department.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="job_description"
                value={this.state.organization.job_description}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.job_description.label')}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-orga-form__switch">
              <CheckboxFieldGroup
                name="is_primary"
                value={this.state.organization.is_primary}
                onChange={this.handleSwitchChange}
                label={__('contact.orga_form.is_primary.label')}
                displaySwitch
                showTextLabel
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-orga-form__action">
              <Button type="submit" display="expanded" shape="plain" icon="plus">
                {__('contact.action.add_orga_detail')}
              </Button>
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default OrgaForm;
