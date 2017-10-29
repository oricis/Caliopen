import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResultsLayout from '../../layouts/SearchResults';

class SearchResults extends Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    term: PropTypes.string,
    doctype: PropTypes.string,
    searchResults: PropTypes.shape({}),
    searchResultsPreview: PropTypes.shape({}),
  };
  static defaultProps = {
    term: undefined,
    doctype: undefined,
    searchResults: undefined,
    searchResultsPreview: undefined,
  };
  state = {};

  componentWillMount() {
  }

  componentDidMount() {
    const { term, doctype, search } = this.props;

    if (term) {
      search({ term });
      if (doctype) {
        search({ term, doctype });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { term, doctype, search } = this.props;
    if (nextProps.term !== term || nextProps.doctype !== doctype) {
      search({ term: nextProps.term, doctype: nextProps.doctype });
    }
  }

  renderPreview = () => (<div>Preview</div>);
  renderResults = () => (<div>Results</div>);

  render() {
    const { term, doctype, searchResultsPreview } = this.props;

    return (
      <SearchResultsLayout
        className="s-search-results"
        term={term}
        searchResultsPreview={searchResultsPreview}
      >
        {doctype ? this.renderResults() : this.renderPreview()}
      </SearchResultsLayout>
    );
  }
}

export default SearchResults;
