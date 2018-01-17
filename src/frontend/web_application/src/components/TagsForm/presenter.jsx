import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu';
import VerticalMenu, { VerticalMenuItem } from '../VerticalMenu';
import Icon from '../Icon';
import { getTagLabel } from '../../modules/tags';
import TagItem from './components/TagItem';
import TagSearch from './components/TagSearch';

import './style.scss';

class TagsForm extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    foundTags: PropTypes.arrayOf(PropTypes.shape({})),
    search: PropTypes.func.isRequired,
    isTagSearchFetching: PropTypes.bool,
    updateTags: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    tags: [],
    foundTags: [],
    isTagSearchFetching: false,
  };

  state = {
    errors: [],
    searchTerms: '',
    isTagCollectionUpdating: false,
  };

  updateTags = async ({ tags }) => {
    const { updateTags } = this.props;
    this.setState({ isTagCollectionUpdating: true });
    try {
      await updateTags({ tags });
    } catch (errors) {
      this.setState({
        errors: [(<Trans id="settings.tag.form.error.create_fail">Unable to create the tag. A tag with the same id may already exist.</Trans>)],
        isTagCollectionUpdating: false,
      });

      return Promise.reject();
    }
    this.setState({ isTagCollectionUpdating: false });

    return undefined;
  }

  handleSearchChange = (searchTerms) => {
    this.setState({ searchTerms, errors: [] });
    this.props.search(searchTerms);
  }

  handleAddNewTag = async (terms) => {
    if (terms.length > 0) {
      const { tags } = this.props;
      await this.updateTags({ tags: [...tags, { label: terms }] });
      this.handleSearchChange('');
    }
  }

  createHandleAddTag = tag => async () => {
    const { tags } = this.props;
    await this.updateTags({ tags: [...tags, tag] });
    this.handleSearchChange('');
  }

  handleDeleteTag = ({ tag }) => {
    const { tags } = this.props;
    this.updateTags({ tags: tags.filter(item => item !== tag) });
  }

  render() {
    const { i18n, tags, foundTags, isTagSearchFetching } = this.props;

    return (
      <div className="m-tags-form">
        <div className="m-tags-form__section">
          {tags && tags.length > 0 && tags.map(tag =>
            <TagItem tag={tag} key={tag.name} onDelete={this.handleDeleteTag} />
          )}
        </div>

        <div className="m-tags-form__section">
          <TagSearch
            errors={this.state.errors}
            terms={this.state.searchTerms}
            isFetching={isTagSearchFetching || this.state.isTagCollectionUpdating}
            onChange={this.handleSearchChange}
            onSubmit={this.handleAddNewTag}
          />
          <DropdownMenu show={foundTags.length > 0} className="m-tags-form__dropdown">
            <VerticalMenu>
              {foundTags.map(tag => (
                <VerticalMenuItem key={tag.name}>
                  <Button
                    className="m-tags-form__found-tag"
                    display="expanded"
                    shape="plain"
                    onClick={this.createHandleAddTag(tag)}
                  >
                    <span className="m-tags-form__found-tag-text">{getTagLabel(i18n, tag)}</span>
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
