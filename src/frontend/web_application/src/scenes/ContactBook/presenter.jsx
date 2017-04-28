import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContactList from './components/ContactList';
import ContactFilters from './components/ContactFilters';
import TagList from './components/TagList';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';

import './style.scss';

export const SORT_VIEW_GIVEN_NAME = 'given_name';
export const SORT_VIEW_FAMILY_NAME = 'family_name';

const DEFAULT_SORT_VIEW = SORT_VIEW_GIVEN_NAME;
const DEFAULT_SORT_DIR = 'ASC';

function getOrderedContacts(contactList, sortView, sortDir) {
  const altSortView = 'title';
  const sortedContacts = contactList.sort((a, b) => {
    const first = a[sortView] ? a[sortView] : a[altSortView];
    const second = b[sortView] ? b[sortView] : b[altSortView];

    switch (sortDir) {
      case 'ASC':
        return first.localeCompare(second);
      default:
      case 'DESC':
        return second.localeCompare(first);
    }
  });

  return sortedContacts;
}

function getFilteredContacts(contactList, activeTag) {
  let filteredContacts = contactList.filter(contact => contact.tags.includes(activeTag));
  if (activeTag === '') { filteredContacts = contactList; }

  return filteredContacts;
}


class ContactBook extends Component {
  static propTypes = {
    requestContacts: PropTypes.func.isRequired,
    loadMoreContacts: PropTypes.func.isRequired,
    contacts: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    contacts: [],
    isFetching: false,
    hasMore: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTag: '',
      sortDir: DEFAULT_SORT_DIR,
      sortView: DEFAULT_SORT_VIEW,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.requestContacts();
  }

  loadMore() {
    this.props.loadMoreContacts();
  }

  render() {
    const handleTagClick = (event) => {
      this.setState({
        activeTag: event.target.value,
      });
    };

    const handleSortDirChange = (event) => {
      this.setState({
        sortDir: event.target.value,
      });
    };

    const handleSortViewChange = (event) => {
      this.setState({
        sortView: event.target.value,
      });
    };

    const { contacts, isFetching, hasMore, __ } = this.props;

    const tags = [].concat(...contacts.map(contact => contact.tags));

    return (
      <div className="l-contact-book">
        <div className="l-contact-book__filters">
          <ContactFilters
            onSortDirChange={handleSortDirChange}
            onSortViewChange={handleSortViewChange}
            sortDir={this.state.sortDir}
            sortView={this.state.sortView}
            __={__}
          />
        </div>
        <div className="l-contact-book__contacts">
          <div className="l-contact-book__tags">
            <TagList
              tags={tags}
              activeTag={this.state.activeTag}
              onTagClick={handleTagClick}
              nbContactsAll={contacts.length}
              __={__}
            />
          </div>
          <div className="l-contact-book__contact-list">
            {isFetching &&
              <Spinner isLoading={isFetching} />
            }
            <ContactList
              contacts={getOrderedContacts(
                  getFilteredContacts(contacts, this.state.activeTag),
                  this.state.sortView,
                  this.state.sortDir
              )}
              sortView={this.state.sortView}
            />
            {hasMore && (
              <div className="l-contact-book-list__load-more">
                <Button hollow onClick={this.loadMore}>{__('general.action.load_more')}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ContactBook;
