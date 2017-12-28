import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu';
import VerticalMenu, { VerticalMenuItem } from '../VerticalMenu';
import Icon from '../Icon';
import TagItem from './components/TagItem';
import TagSearch from './components/TagSearch';

import './style.scss';

class TagsForm extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    foundTags: PropTypes.arrayOf(PropTypes.shape({})),
    search: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    updateTag: PropTypes.func.isRequired,
    isTagSearchFetching: PropTypes.bool,
  };

  static defaultProps = {
    tags: [],
    foundTags: [],
    isTagSearchFetching: false,
  };

  state = {
    searchTerms: '',
  };

  handleSearchChange = (terms) => {
    this.props.search(terms);
  }

  handleAddNewTag = (terms) => {
    if (terms.length > 0) {
      this.props.addTag({ label: terms });
    }
  }

  createHandleAddTag = tag => () => {
    this.props.addTag(tag);
  }

  render() {
    const { tags, updateTag, foundTags, isTagSearchFetching } = this.props;

    return (
      <div className="m-tags-form">
        <div className="m-tags-form__section">
          {tags && tags.length > 0 && tags.map(tag =>
            <TagItem tag={tag} key={tag.tag_id} onDelete={updateTag} />
          )}
        </div>

        <div className="m-tags-form__section">
          <TagSearch
            isFetching={isTagSearchFetching}
            onChange={this.handleSearchChange}
            onSubmit={this.handleAddNewTag}
          />
          <DropdownMenu show={foundTags.length > 0} className="m-tags-form__dropdown">
            <VerticalMenu>
              {foundTags.map(tag => (
                <VerticalMenuItem key={tag.tag_id}>
                  <Button
                    className="m-tags-form__found-tag"
                    display="expanded"
                    shape="plain"
                    onClick={this.createHandleAddTag(tag)}
                  >
                    <span className="m-tags-form__found-tag-text">{tag.name}</span>
                    {' '}
                    <Icon type="plus" />
                  </Button>
                </VerticalMenuItem>
              ))}
            </VerticalMenu>
          </DropdownMenu>
        </div>
      </div>
    );
  }
}

export default TagsForm;
