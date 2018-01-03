import { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

class WithUpdateEntityTags extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    requestTags: PropTypes.func.isRequired,
    createTag: PropTypes.func.isRequired,
    updateTagCollection: PropTypes.func.isRequired,
  };
  static defaultProps = {
    isFetching: false,
    isInvalidated: false,
  };

  getTagFromLabel = (tags, label) => tags
    .find(tag => tag.label.toLowerCase() === label.toLowerCase());

  createMissingTags = async (tagCollection) => {
    const { tags, requestTags } = this.props;
    const knownLabels = tags.map(tag => tag.label.toLowerCase());
    const newTags = tagCollection
      .filter(tag => !tag.name)
      .filter(tag => !knownLabels.includes(tag.label.toLowerCase()));

    if (!newTags.length) {
      return tags;
    }

    await Promise.all(newTags.map(tag => this.props.createTag(tag)));

    return requestTags();
  }

  updateEntityTags = async (type, entity, { tags: tagCollection }) => {
    const upToDateTags = await this.createMissingTags(tagCollection);
    const normalizedTags = tagCollection.reduce((acc, tag) => [
      ...acc,
      !tag.name ? this.getTagFromLabel(upToDateTags, tag.label) : tag,
    ], []);
    const tagNames = normalizedTags.map(tag => tag.name);

    if (!isEqual(entity.tags, tagCollection.map(tag => tag.name))) {
      return this.props.updateTagCollection(type, entity, {
        tags: tagNames,
      });
    }

    return undefined;
  }

  render() {
    const { render } = this.props;

    return render(this.updateEntityTags);
  }
}

export default WithUpdateEntityTags;
