import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';

import './style.scss';

const IDENTITY_TYPES = ['twitter', 'facebook', 'other'];

class IdentityForm extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: [],
  };

  state = {
    contactDetail: {
      type: IDENTITY_TYPES[0],
      name: '',
    },
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ contactDetail });
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

  render() {
    const { __, errors } = this.props;
    const identityTypeOptions = IDENTITY_TYPES.map(value => ({
      value,
      label: value,
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-identity-form" name="identity_form">
        <Fieldset>
          <Legend>
            <Icon rightSpaced type="user" />
            {__('contact.identity_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="medium">
              <TextFieldGroup
                name="name"
                type="text"
                value={this.state.contactDetail.name}
                onChange={this.handleInputChange}
                label={__('contact.identity_form.identity.label')}
                showLabelforSr
              />
            </FormColumn>
            <FormColumn size="shrink">
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.identity_form.service.label')}
                options={identityTypeOptions}
                showLabelforSr
              />
            </FormColumn>
            <FormColumn size="shrink" className="m-identity-form__action">
              <Button type="submit" display="expanded" shape="plain" icon="plus">
                {__('contact.action.add_identity_detail')}
              </Button>
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default IdentityForm;
