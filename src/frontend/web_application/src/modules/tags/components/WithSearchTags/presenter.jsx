import { Component } from 'react';
import PropTypes from 'prop-types';
import { getTagLabel } from '../../services/getTagLabel';

class WithSearchTags extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    render: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isFetching: PropTypes.bool,
  };
  static defaultProps = {
    isFetching: false,
  };
  state = {
    terms: '',
    foundTags: [],
  };

  search = terms => new Promise((resolve) => {
    if (!terms.length) {
      this.setState({ foundTags: [] }, () => resolve(this.state.foundTags));

      return;
    }

    const { i18n } = this.props;
    const findTags = tagsInState => tagsInState
      .filter(tag => getTagLabel(i18n, tag).toLowerCase().startsWith(terms.toLowerCase()));

    this.setState(
      { terms, foundTags: findTags(this.props.tags) },
      () => {
        resolve(this.state.foundTags);
      }
    );
  });

  render() {
    const { render, isFetching } = this.props;

    return render(this.search, this.state.foundTags, isFetching);
  }
}

export default WithSearchTags;
