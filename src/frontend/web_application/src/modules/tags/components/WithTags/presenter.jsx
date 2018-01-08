import { Component } from 'react';
import PropTypes from 'prop-types';

class WithTags extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    requestTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    isInvalidated: PropTypes.bool,
  }
  static defaultProps = {
    tags: [],
    isFetching: false,
    isInvalidated: false,
  }

  componentDidMount() {
    const { requestTags, tags, isInvalidated, isFetching } = this.props;
    if (!isFetching && (!tags.length || isInvalidated)) {
      requestTags();
    }
  }

  render() {
    const { tags, isFetching, render } = this.props;

    return render(tags, isFetching);
  }
}

export default WithTags;
