import React, { PureComponent } from 'react';
import { Trans } from 'lingui-react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import MenuBar from '../../components/MenuBar';

class SearchResults extends PureComponent {
  static propTypes = {
    pathname: PropTypes.string,
    search: PropTypes.string,
    term: PropTypes.string,
    searchResultsPreview: PropTypes.shape({}),
    children: PropTypes.node,
  };
  static defaultProps = {
    pathname: undefined,
    search: undefined,
    term: '',
    searchResultsPreview: {
      contact_hits: {
        total: 0,
      },
      messages_hits: {
        total: 0,
      },
      total: 0,
    },
    children: null,
  };

  render() {
    const {
      children,
      pathname,
      search,
      term,
      searchResultsPreview: {
        total,
        contact_hits: { total: nbContacts },
        messages_hits: { total: nbMessages },
      },
    } = this.props;

    const location = `${pathname}${search}`;

    const navLinks = [
      { title: <Trans id="search-results.all" values={{ total }}>All ({total})</Trans>, to: `/search-results?term=${term}` },
      { title: <Trans id="search-results.messages" values={{ nbMessages }}>Messages ({nbMessages})</Trans>, to: `/search-results?term=${term}&doctype=message` },
      { title: <Trans id="search-results.contacts" values={{ nbContacts }}>Contacts ({nbContacts})</Trans>, to: `/search-results?term=${term}&doctype=contact` },
    ].map(link => ({
      ...link,
      isActive: matchPath(location, { path: link.to, exact: false, strict: false }) && true,
    }));

    return (
      <div className="l-search-results">
        <MenuBar className="l-search-results__menu-bar" navLinks={navLinks} />
        <div className="l-search-results__panel">{children}</div>
      </div>
    );
  }
}

export default SearchResults;
