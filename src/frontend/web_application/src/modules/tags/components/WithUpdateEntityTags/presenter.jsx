import { Component } from 'react';
import PropTypes from 'prop-types';

class WithUpdateEntityTags extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    render: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    updateTagCollection: PropTypes.func.isRequired,
  };
  static defaultProps = {
    tags: [],
    isFetching: false,
    isInvalidated: false,
  };

  updateEntityTags = (type, entity, { tags: tagCollection }) => {
    const { updateTagCollection, i18n, tags } = this.props;

    return updateTagCollection(i18n, tags, type, entity, { tags: tagCollection });
  }

  render() {
    const { render } = this.props;

    return render(this.updateEntityTags);
  }
}

export default WithUpdateEntityTags;
