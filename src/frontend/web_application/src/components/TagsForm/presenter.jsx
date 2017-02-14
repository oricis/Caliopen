import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Modal from '../Modal';
import { TextFieldGroup, FormGrid, FormRow } from '../form';
import TagInput from './components/TagInput';

import './style.scss';

const tags = ['work', 'bank', 'friends', 'france', 'tag'];
const noop = str => str;

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
    const title = [
      __('tags.header.title'),
      <span key={tags} className="m-tags__header-count">({__('tags.count')}: x)</span>,
    ];

    return (
      <Modal className="m-tags" title={title}>
        <FormGrid className="m-tags__form" name="tags_form" {...form}>
          <FormRow className="m-tags__search">
            <TextFieldGroup
              id="tags-search"
              name="search"
              className="m-tags__search-input"
              label={__('tags.form.search.label')}
              placeholder={__('tags.form.search.placeholder')}
              onChange={this.handleInputChange}
              showLabelforSr
            />
            <Button inline onClick={this.handleSubmit}><Icon type="search" spaced /></Button>
          </FormRow>
        </FormGrid>
        <div className="m-tags__list">
          {tags.map(tag =>
            <TagInput
              tag={tag}
              key={tag}
              __={noop}
            />)}
        </div>
        <FormGrid>
          <FormRow className="m-tags__action" >
            <Button
              type="submit"
              onClick={this.handleSubmit}
              plain
            >{__('tags.action.create')}</Button>
          </FormRow>
        </FormGrid>
      </Modal>
    );
  }
}

export default TagsForm;
