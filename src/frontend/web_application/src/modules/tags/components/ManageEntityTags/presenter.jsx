import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TagsForm from '../../../../components/TagsForm';
import WithTags from '../WithTags';
import WithSearchTags from '../WithSearchTags';
import WithUpdateEntityTags from '../WithUpdateEntityTags';

class ManageEntityTags extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    entity: PropTypes.shape({}).isRequired,
  };

  filterFoundTags = (tags) => {
    const { entity } = this.props;

    return tags.filter(tag => !entity.tags.some(name => name === tag.name));
  };

  renderTagsForm({ tags, search, foundTags, isSearchFetching, updateEntityTags }) {
    const { entity, type } = this.props;
    const tagCollection = entity.tags.map(tag => tags.find(item => item.name === tag));
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
    return (
      <WithTags
        render={(tags, isTagsFetching) => (
          <WithUpdateEntityTags
            tags={tags}
            render={updateEntityTags => this.renderSearchTags({
              updateEntityTags, tags, isTagsFetching,
            })}
          />
        )}
      />
    );
  }
}

export default ManageEntityTags;
