import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { paramsSelector } from '../../store/selectors/router';
import { search, getKey } from '../../store/modules/search';
import Presenter from './presenter';

const searchResultsSelector = state => state.search.resultsByKey;

const mapStateToProps = createSelector(
  [paramsSelector, searchResultsSelector],
  (params, searchResultsByKey) => {
    if (!params) {
      return {};
    }

    const { term, doctype } = params;

    return {
      term,
      doctype,
      searchResults: searchResultsByKey[getKey(term, doctype)],
      searchResultsPreview: searchResultsByKey[getKey(term, '')],
    };
  }
);
const mapDispatchToProps = dispatch => bindActionCreators({
  search,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
