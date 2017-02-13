import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Badge from '../Badge';
import Icon from '../Icon';
import Section from '../Section';
import { TextFieldGroup, FormGrid, FormRow, FormColumn } from '../form';
import './style.scss';

const tags = ['work', 'bank', 'tag3'];

const TagInput = ({ tag }) => (
  <Badge className="m-tags-list__item">
    <span className="m-tags-list__text">{tag}</span>
    <Icon type="edit" className="m-tags-list__icon" />
  </Badge>
);
TagInput.propTypes = {
  tag: PropTypes.string,
};

class TagsForm extends Component {
  static propTypes = {
    form: PropTypes.shape({}),
    formValues: PropTypes.shape({}),
    onSubmit: PropTypes.func,
    __: PropTypes.func,
  };


  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        tag: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formValues: {
        ...prevState.formValues,
        [name]: value,
      },
    }));
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { formValues } = this.state;
    this.props.onSubmit({ formValues });
  }

  render() {
    const { form, __ } = this.props;

    return (
      <div className="m-tags">
        <Section className="m-tags__header">
          <h3 className="m-tags__header-title">{__('tags.header.title')} <span>({__('tags.count')}: x)</span></h3>
          <Button className="m-tags__header-close"><Icon type="remove" /></Button>
        </Section>
        <Section className="m-tags__form">
          <FormGrid className="m-tags-form" name="tags_form" {...form}>
            <FormRow className="m-tags-form__search">
              <TextFieldGroup
                id="tags-search"
                name="search"
                className="m-tags-form__search-input"
                label={__('tags.form.search.label')}
                placeholder={__('tags.form.search.placeholder')}
                defaultValue={this.state.formValues.tag}
                onChange={this.handleInputChange}
                showLabelforSr
              />
              <Button plain className="m-tags-form__search-button" onClick={this.handleSubmitTagsSearch}>
                <Icon type="search" />
              </Button>
            </FormRow>
          </FormGrid>
          <div className="m-tags-list">
            {tags.map(tag => <TagInput tag={tag} />)}
          </div>
          <FormGrid>

            <FormRow className="m-tags-form__action" >
              <Button
                type="submit"
                onClick={this.handleSubmit}
                plain
              >{__('tags.action.create')}</Button>
            </FormRow>
          </FormGrid>
        </Section>
      </div>
    );
  }
}

export default TagsForm;
