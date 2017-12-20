import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { FieldArray, FormSection } from 'redux-form';
import Button from '../../../../components/Button';
import TextList, { ItemContent } from '../../../../components/TextList';
import { FormGrid, FormRow, FormColumn } from '../../../../components/form';

class FormCollection extends PureComponent {
  static propTypes = {
    propertyName: PropTypes.string.isRequired,
    component: PropTypes.element.isRequired,
    showAdd: PropTypes.bool,
  };
  static defaultProps = {
    showAdd: true,
  };

  renderForms = ({ fields }) => {
    const { component, showAdd } = this.props;

    return (
      <TextList>
        {fields.map((fieldName, index) => (
          <ItemContent key={index} large>
            <FormSection name={fieldName}>
              <component.type onDelete={() => fields.remove(index)} />
            </FormSection>
          </ItemContent>
        ))}
        {showAdd && (
          <ItemContent large>
            <FormGrid>
              <FormRow>
                <FormColumn>
                  <Button icon="plus" shape="plain" onClick={() => fields.push({ })}>
                    <Trans id="contact.action.add_new_field">contact.action.add_new_field</Trans>
                  </Button>
                </FormColumn>
              </FormRow>
            </FormGrid>
          </ItemContent>
        )}
      </TextList>
    );
  };

  render() {
    const { propertyName } = this.props;

    return (
      <FieldArray name={propertyName} component={this.renderForms} />
    );
  }
}

export default FormCollection;
