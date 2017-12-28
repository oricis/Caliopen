import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TagsForm from '../../../../components/TagsForm';
import { WithSearchTags } from '../../../../modules/tags';

class ManageTags extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    updateMessage: PropTypes.func.isRequired,
  };

  handleTagsChange = ({ tags }) => {
    const { message: original, updateMessage } = this.props;

    const message = {
      ...original,
      tags,
    };

    return updateMessage({ message, original });
  };

  handleAddTag = (tag) => {
    const { message } = this.props;
    const tags = [
      ...(message.tags ? message.tags : []),
      tag,
    ];

    return this.handleTagsChange({ tags });
  };

  filterTags = (tags) => {
    const { message } = this.props;

    return tags.filter(tag => !message.tags.some(messageTag => messageTag === tag));
  };

  render() {
    const { message } = this.props;

    return (
      <WithSearchTags
        render={(search, foundTags, isFetching) => (
          <TagsForm
            tags={message.tags}
            foundTags={this.filterTags(foundTags)}
            search={search}
            isTagSearchFetching={isFetching}
            updateTag={this.handleTagsChange}
            addTag={this.handleAddTag}
          />
        )}
      />
    );
  }
}

export default ManageTags;
