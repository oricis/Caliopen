import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';

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

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      orgaDetails: {
        name: '',
        department: '',
        job_description: '',
      },
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { orgaDetails } = this.state;
    this.props.onSubmit({ organization: orgaDetails });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      orgaDetails: {
        ...prevState.orgaDetails,
        [name]: value,
      },
    }));
  }

  render() {
    const { __, errors } = this.props;

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-orga-form" name="orga_form">
        <Fieldset>
          <Legend>
            <Icon className="m-orga-form__icon" type="building" />
            {__('contact.orga_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="large">
              <TextFieldGroup
                name="name"
                type="text"
                value={this.state.orgaDetails.name}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.name.label')}
                required
              />
            </FormColumn>
            <FormColumn size="large">
              <TextFieldGroup
                name="department"
                type="text"
                value={this.state.orgaDetails.department}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.department.label')}
              />
            </FormColumn>
            <FormColumn size="large">
              <TextFieldGroup
                name="job_description"
                type="text"
                value={this.state.orgaDetails.job_description}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.job_description.label')}
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
