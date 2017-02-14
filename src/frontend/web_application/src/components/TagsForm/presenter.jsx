import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Modal from '../Modal';
import { TextFieldGroup, FormGrid, FormRow } from '../form';
import TagInput from './components/TagInput';

import './style.scss';

const noop = str => str;

class TagsForm extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.shape({}),
    formValues: PropTypes.shape({}),
    onSubmit: PropTypes.func,
    __: PropTypes.func,
  };


  constructor(props) {
    super(props);
    this.state = {};

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
    const tagNb = this.props.tags.length;
    const title = [
      __('tags.header.title'),
      <span key={this.props.tags} className="m-tags__header-count">({__('tags.header.count')}: {tagNb})</span>,
    ];


    return (
      <Modal className="m-tags" title={title}>
        <FormGrid className="m-tags__form" name="tags-form" {...form}>
          <div className="m-tags__search">
            <TextFieldGroup
              id="tags-search"
              name="tags-search"
              className="m-tags__search-input"
              label={__('tags.form.search.label')}
              placeholder={__('tags.form.search.placeholder')}
              onChange={this.handleInputChange}
              showLabelforSr
            />
            <Button inline onClick={this.handleSubmit}><Icon type="search" /></Button>
          </div>
        </FormGrid>
        <div className="m-tags__list">
          {this.props.tags.map(tag => <TagInput tag={tag} key={tag} __={noop} />)}
        </div>
        <FormGrid>
          <Button
            className="m-tags__action"
            type="submit"
            onClick={this.handleSubmit}
            plain
          >{__('tags.action.create')}</Button>
        </FormGrid>
      </Modal>
    );
  }
}

export default TagsForm;
