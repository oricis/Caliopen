import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Icon from '../Icon';
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

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleSearchChange(e) {
    this.props.onChange(e);
  }

  handleSearchSubmit(ev) {
    ev.preventDefault();
    this.props.onSubmit(ev);
  }

  handleCreate(ev) {
    ev.preventDefault();
    this.props.onSubmit(ev);
  }

  render() {
    const { __ } = this.props;

    return (
      <div className="m-tags-form">
        <TagSearch
          onChange={this.handleSearchChange}
          onSubmit={this.handleSearchSubmit}
          __={__}
        />

        <div className="m-tags__section">
          {this.props.tags.map(tag =>
            <TagItem tag={tag} key={tag} __={noop} />
          )}
        </div>

        <FormGrid>
          <Button
            className="m-tags__action"
            type="submit"
            onSubmit={this.handleSearchSubmit}
            plain
          >
            <Icon type="plus" spaced /> {__('tags.action.create')}
          </Button>
        </FormGrid>
      </div>
    );
  }
}

export default TagsForm;
