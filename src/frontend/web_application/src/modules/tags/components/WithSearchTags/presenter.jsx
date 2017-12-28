import { Component } from 'react';
import PropTypes from 'prop-types';

class WithSearchTags extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isFetching: PropTypes.bool,
    isInvalidated: PropTypes.bool,
    requestTags: PropTypes.func.isRequired,
  };
  static defaultProps = {
    isFetching: false,
    isInvalidated: false,
  };
  state = {
    terms: '',
    foundTags: [],
  };

  search = (terms) => {
    if (!terms.length) {
      this.setState({ foundTags: [] });

      return Promise.resolve([]);
    }
    const { requestTags } = this.props;
    const findTags = tagsInState => tagsInState
      .filter(tag => tag.label.toLowerCase().startsWith(terms.toLowerCase()));

    this.setState({ terms, foundTags: findTags(this.props.tags) });

    if (!this.props.tags.length || this.props.isInvalidated) {
      return requestTags()
        .then(() => this.setState({ foundTags: findTags(this.props.tags) }))
        .then(() => this.state.foundTags);
    }

    return Promise.resolve(this.state.foundTags);
  }

  render() {
    const { render, isFetching } = this.props;

    return render(this.search, this.state.foundTags, isFetching);
  }
}

export default WithSearchTags;
