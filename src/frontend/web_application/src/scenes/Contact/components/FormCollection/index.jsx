import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, FormSection } from 'redux-form';
import { withTranslator } from '@gandi/react-translate';
import Button from '../../../../components/Button';
import TextList, { ItemContent } from '../../../../components/TextList';

@withTranslator()
class FormCollection extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
    propertyName: PropTypes.string.isRequired,
    component: PropTypes.element.isRequired,
    hideAddIfEmpty: PropTypes.bool,
  };
  static defaultProps = {
    hideAddIfEmpty: false,
  };

  renderForms = ({ fields }) => {
    const { component, hideAddIfEmpty, __ } = this.props;

    return (
      <TextList>
        {fields.map((fieldName, index) => (
          <ItemContent key={index} large>
            <FormSection name={fieldName}>
              <component.type onDelete={() => fields.remove(index)} />
            </FormSection>
          </ItemContent>
        ))}
        {(!hideAddIfEmpty || fields.length !== 0) && (
          <ItemContent large>
            <Button icon="plus" shape="plain" onClick={() => fields.push({ })}>
              {__('contact.action.add_new_field')}
            </Button>
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
