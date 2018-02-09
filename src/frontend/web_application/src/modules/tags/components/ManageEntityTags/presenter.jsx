import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TagsForm from '../TagsForm';
import WithTags from '../WithTags';
import WithSearchTags from '../WithSearchTags';
import { getCleanedTagCollection } from '../../services/getTagLabel';

class ManageEntityTags extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    entity: PropTypes.shape({}),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: undefined,
  };

  filterFoundTags = (tags) => {
    const { entity } = this.props;

    if (!entity || !entity.tags) {
      return tags;
    }

    return tags.filter(tag => !entity.tags.some(name => name === tag.name));
  };

  renderTagsForm({ tags, search, foundTags, isSearchFetching, updateEntityTags }) {
    const { entity, type } = this.props;
    const tagCollection = (!entity || !entity.tags) ?
      [] :
      getCleanedTagCollection(tags, entity.tags);
    const updateEntityTagsBound = updateEntityTags.bind(null, type, entity);

    return (
      <TagsForm
        tags={tagCollection}
        foundTags={this.filterFoundTags(foundTags)}
        search={search}
        isTagSearchFetching={isSearchFetching}
        updateTags={updateEntityTagsBound}
      />
    );
  }

  renderSearchTags({ updateEntityTags, tags, isTagsFetching }) {
    return (
      <WithSearchTags
        tags={tags}
        isFetching={isTagsFetching}
        render={(search, foundTags, isFetching) => this.renderTagsForm({
          tags,
          search,
          foundTags,
          isSearchFetching: isFetching,
          updateEntityTags,
        })}
      />
    );
  }

  render() {
    const { entity, onChange } = this.props;

    return (
      <WithTags
        render={(tags, isTagsFetching) => (
          <WithSearchTags
            tags={tags}
            isFetching={isTagsFetching}
            render={(search, foundTags, isSearchFetching) => (
              <TagsForm
                tags={(!entity || !entity.tags) ? [] : getCleanedTagCollection(tags, entity.tags)}
                foundTags={this.filterFoundTags(foundTags)}
                search={search}
                isTagSearchFetching={isSearchFetching}
                updateTags={onChange}
              />
            )}
          />
        )}
      />
    );
  }
}

export default ManageEntityTags;
