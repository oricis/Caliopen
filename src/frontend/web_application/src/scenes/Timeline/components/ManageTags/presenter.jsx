import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TagsForm from '../../../../components/TagsForm';
import { WithTags, WithSearchTags, WithUpdateEntityTags } from '../../../../modules/tags';

class ManageTags extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
  };

  filterFoundTags = (tags) => {
    const { message } = this.props;

    return tags.filter(tag => !message.tags.some(name => name === tag.name));
  };

  renderTagsForm({ tags, search, foundTags, isSearchFetching, updateEntityTags }) {
    const { message } = this.props;
    const tagCollection = message.tags.map(tag => tags.find(item => item.name === tag));
    const updateMessageTags = updateEntityTags.bind(null, 'message', message);

    return (
      <TagsForm
        tags={tagCollection}
        foundTags={this.filterFoundTags(foundTags)}
        search={search}
        isTagSearchFetching={isSearchFetching}
        updateTags={updateMessageTags}
      />
    );
  }

  renderSearchTags({ updateEntityTags, tags, isTagsFetching }) {
    return (
      <WithSearchTags
        tags={tags}
        isFetching={isTagsFetching}
        render={(search, foundTags, isFetching) =>
          this.renderTagsForm({
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

export default ManageTags;
