import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContactList from './components/ContactList';
import ContactFilters from './components/ContactFilters';
import TagList from './components/TagList';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';

import './style.scss';

const DEFAULT_SORT_VIEW = 'given_name';
const DEFAULT_SORT_DIR = 'ASC';

function getOrderedContacts(contactList, sortView, sortDir) {
  const sortedContacts = contactList.sort((a, b) => {
    const first = a[sortView] ? a[sortView] : a.title;
    const second = b[sortView] ? b[sortView] : b.title;

    if (sortDir === 'ASC') { return first.localeCompare(second); }
    if (sortDir === 'DESC') { return second.localeCompare(first); }

    return false;
  });

  return sortedContacts;
}

function getFilteredContacts(contactList, activeTag) {
  let filteredContacts = contactList.filter(contact => contact.tags.includes(activeTag));
  if (activeTag === '') { filteredContacts = contactList; }

  return filteredContacts;
}

function generateStateFromProps(props) {
  const { contacts } = props;
  const tags = [].concat(...contacts.map(contact => contact.tags));

  return { tags };
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
      tags: [].concat(generateStateFromProps.bind(props)),
      activeTag: '',
      sortDir: DEFAULT_SORT_DIR,
      sortView: DEFAULT_SORT_VIEW,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.requestContacts();
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
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
