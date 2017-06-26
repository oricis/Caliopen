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
      organization: {
        name: '',
        department: '',
        job_description: '',
      },
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { organization } = this.state;
    this.props.onSubmit({ contactDetail: organization });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      organization: {
        ...prevState.organization,
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
