import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, FormGrid, FormRow, FormColumn, CheckboxFieldGroup } from '../../../form';

import './style.scss';

const generateStateFromProps = (props, prevState) => {
  const organization = props.organization || {};

  return {
    contactDetail: {
      ...prevState.contactDetail,
      ...organization,
    },
  };
};


class OrgaForm extends Component {
  static propTypes = {
    organization: PropTypes.shape({}),
    errors: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: [],
    organization: null,
    onDelete: () => {},
    onEdit: () => {},
    onSubmit: () => {},
  };

  state = {
    contactDetail: {
      department: '',
      is_primary: false,
      job_description: '',
      label: '',
      name: '',
      title: '',
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => generateStateFromProps(nextProps, prevState));
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ contactDetail });
  }

  handleDelete = () => {
    const { onDelete, organization } = this.props;
    onDelete({ contactDetail: organization });
  }

  handleEdit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onEdit({ contactDetail });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        [name]: value,
      },
    }));
  }

  handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        [name]: checked,
      },
    }));
  }

  render() {
    const { __, errors, organization } = this.props;

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
                value={this.state.contactDetail.label}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.label.label')}
                required
              />
            </FormColumn>
            <FormColumn>
              <TextFieldGroup
                name="name"
                value={this.state.contactDetail.name}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.name.label')}
                required
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="title"
                value={this.state.contactDetail.title}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.title.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="department"
                value={this.state.contactDetail.department}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.department.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="job_description"
                value={this.state.contactDetail.job_description}
                onChange={this.handleInputChange}
                label={__('contact.orga_form.job_description.label')}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-orga-form__switch">
              <CheckboxFieldGroup
                name="is_primary"
                checked={this.state.contactDetail.is_primary}
                onChange={this.handleSwitchChange}
                label={__('contact.orga_form.is_primary.label')}
                displaySwitch
                showTextLabel
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-orga-form__action">
              {!organization ?
                <Button type="submit" shape="plain" icon="plus" responsive="icon-only">
                  {__('contact.action.add_contact_detail')}
                </Button>
              :
                <Button icon="remove" onClick={this.handleDelete} />
              }
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default OrgaForm;
