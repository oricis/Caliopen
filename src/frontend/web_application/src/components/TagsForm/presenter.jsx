import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Modal from '../Modal';
import { FormGrid } from '../form';
import TagItem from './components/TagItem';
import TagSearch from './components/TagSearch';

import './style.scss';

const noop = str => str;

class TagsForm extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    __: PropTypes.func,
  };


  constructor(props) {
    super(props);
    this.state = {};

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    this.props.onChange(e);
  }

  handleSubmit(e) {
    this.props.onSubmit(e);
  }


  render() {
    const { __ } = this.props;
    const countTags = this.props.tags.length;
    const title = [
      __('tags.header.title'),
      <span key={this.props.tags} className="m-tags__count">({__('tags.header.count')}: {countTags})</span>,
    ];


    return (
      <Modal className="m-tags" title={title}>
        <TagSearch __={noop} />

        <div className="m-tags__section">
          {this.props.tags.map(tag =>
            <TagItem tag={tag} key={tag} __={noop} />
          )}
        </div>

        <FormGrid>
          <Button
            className="m-tags__action"
            type="submit"
            onClick={this.handleSubmit}
            plain
          >
            <Icon type="plus" spaced /> {__('tags.action.create')}
          </Button>
        </FormGrid>
      </Modal>
    );
  }
}

export default TagsForm;
