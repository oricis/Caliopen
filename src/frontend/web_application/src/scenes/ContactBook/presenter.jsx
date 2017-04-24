import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContactList from './components/ContactList';
import ContactFilters from './components/ContactFilters';
import TagList from './components/TagList';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';

import './style.scss';

const defaultSortDir = 'ASC';
const defaultSortView = 'title';

function getOrderedContacts(contactList, sortView, sortDir) {
  const sortContacts = contactList.filter(contact => contact[sortView] !== null);
  const sortNullContacts = contactList.filter(contact => contact[sortView] == null);

  if (sortDir === 'ASC') {
    sortContacts.sort((a, b) =>
      a[sortView].localeCompare(b[sortView]));
  }
  if (sortDir === 'DESC') {
    sortContacts.sort((a, b) =>
      b[sortView].localeCompare(a[sortView]));
  }

  return sortNullContacts.concat(sortContacts);
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
      tags: [],
      activeTag: '',
      sortDir: defaultSortDir,
      sortView: defaultSortView,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.requestContacts();
    setTimeout(() => {
      this.loadTags();
    }, 200);
  }

  loadMore() {
    this.props.loadMoreContacts();
  }

  loadTags() {
    const tags = [];
    this.props.contacts.map(contact => contact.tags.map(tag => tags.push(tag)));
    this.setState({
      tags,
    });
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

    /* const handleSortViewChange = (event) => {
      this.setState({
        sortView: event.target.value,
      });
    };*/

    const { contacts, isFetching, hasMore, __ } = this.props;

    return (
      <div className="l-contact-book">
        <div className="l-contact-book__filters">
          <ContactFilters
            onSortDirChange={handleSortDirChange}
            // onSortViewChange={handleSortViewChange}
            sortDir={this.state.sortDir}
            sortView={this.state.sortView}
            __={__}
          />
        </div>
        <div className="l-contact-book__contacts">
          <div className="l-contact-book__tags">
            <TagList
              tags={this.state.tags}
              activeTag={this.state.activeTag}
              onTagClick={handleTagClick}
              nbContactsAll={contacts.length}
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
