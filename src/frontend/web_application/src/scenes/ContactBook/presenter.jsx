import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from 'lingui-react';
import ContactList from './components/ContactList';
import { PageTitle, Spinner, Button, MenuBar, Checkbox, SidebarLayout, NavList, NavItem, Confirm } from '../../components';
import { withPush } from '../../modules/routing';
import TagList from './components/TagList';
import ImportContactButton from './components/ImportContactButton';
import { withTagSearched } from './hoc/withTagSearched';
import './style.scss';
import './contact-book-menu.scss';

export const SORT_VIEW_GIVEN_NAME = 'given_name';
export const SORT_VIEW_FAMILY_NAME = 'family_name';
export const SORT_VIEW_TITLE = 'title';
export const DEFAULT_SORT_VIEW = SORT_VIEW_GIVEN_NAME;

const DEFAULT_SORT_DIR = 'ASC';

function getFilteredContacts(contactList, tag) {
  if (tag === '') {
    return contactList;
  }

  return contactList.filter(contact => contact.tags && contact.tags.includes(tag));
}

@withTagSearched()
@withPush()
class ContactBook extends Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    requestContacts: PropTypes.func.isRequired,
    loadMoreContacts: PropTypes.func.isRequired,
    deleteContacts: PropTypes.func.isRequired,
    contacts: PropTypes.arrayOf(PropTypes.shape({})),
    tagSearched: PropTypes.string,
    isFetching: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    hasMore: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    contacts: [],
    tagSearched: '',
    isFetching: false,
    didInvalidate: false,
    hasMore: false,
  };

  state = {
    sortDir: DEFAULT_SORT_DIR,
    isDeleting: false,
    selectedEntitiesIds: [],
  };

  componentDidMount() {
    this.props.requestContacts();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.didInvalidate) {
      this.props.requestContacts();
    }
  }

  onSelectEntity = (type, id) => {
    if (type === 'add') {
      this.setState(prevState => ({
        ...prevState,
        selectedEntitiesIds: [...prevState.selectedEntitiesIds, id],
      }));
    }

    if (type === 'remove') {
      this.setState(prevState => ({
        ...prevState,
        selectedEntitiesIds: [...prevState.selectedEntitiesIds].filter(item => item !== id),
      }));
    }
  }

  onSelectAllEntities = (checked) => {
    const { contacts, tagSearched } = this.props;
    const contactIds = getFilteredContacts(contacts, tagSearched)
      .map(({ contact_id: contactId }) => contactId);

    this.setState(prevState => ({
      ...prevState,
      selectedEntitiesIds: checked ? contactIds : [],
    }));
  }

  loadMore = () => {
    this.props.loadMoreContacts();
  }

  handleSelectAllEntitiesChange = (ev) => {
    const { checked } = ev.target;
    this.onSelectAllEntities(checked);
  }

  handleDeleteContacts = async () => {
    const { contacts, deleteContacts } = this.props;
    const selectedContactIds = new Set(this.state.selectedEntitiesIds);

    this.setState(prevState => ({
      ...prevState,
      isDeleting: true,
    }));

    await deleteContacts({
      contacts: contacts.filter(contact => selectedContactIds.has(contact.contact_id)),
    });

    this.setState(prevState => ({
      ...prevState,
      selectedEntitiesIds: [],
      isDeleting: false,
    }));
  }

  handleClickAddContact = () => {
    this.props.push('/new-contact');
  }

  handleClickEditGroups = () => {
    this.props.push('/settings/tags');
  }

  handleUploadSuccess = () => {
    this.props.requestContacts();
  };

  renderMenuBar() {
    const {
      isFetching, contacts,
    } = this.props;

    const count = this.state.selectedEntitiesIds.length;
    const totalCount = contacts.length;

    return (
      <MenuBar className="s-contact-book-menu">
        {isFetching && (
          <div className="s-contact-book-menu__loading">
            <Spinner isLoading={isFetching} display="inline" />
          </div>
        )}
        <div className="s-contact-book-menu__selector">
          {count > 0 && (
            <Fragment>
              <span className="s-contact-book-menu__label">
                <Plural
                  id="contact-book.contacts.selected"
                  value={count}
                  one={<Trans>#/{totalCount} selected contact:</Trans>}
                  other={<Trans>#/{totalCount} selected contacts:</Trans>}
                />
              </span>
              <Confirm
                onConfirm={this.handleDeleteContacts}
                title={(
                  <Plural
                    id="contact-book.confirm-delete.title"
                    value={count}
                    one={<Trans>Delete contact</Trans>}
                    other={<Trans>Delete contacts</Trans>}
                  />
                )}
                content={(
                  <Plural
                    id="contact-book.confirm-delete.content"
                    value={count}
                    one={(
                      <Trans>
                        The deletion is permanent, are you sure you want to delete this contact ?
                      </Trans>
                    )}
                    other={(
                      <Trans>
                        The deletion is permanent, are you sure you want to delete these contacts ?
                      </Trans>
                    )}
                  />
                )}
                render={confirm => (
                  <Button
                    className="s-contact-book-menu__action-btn"
                    display="inline"
                    noDecoration
                    icon={this.state.isDeleting ? (<Spinner isLoading display="inline" />) : 'trash'}
                    onClick={confirm}
                    disabled={this.state.isDeleting}
                  >
                    <Trans id="contact-book.action.delete">Delete</Trans>
                  </Button>
                )}
              />
              <Button
                className="s-contact-book-menu__action-btn"
                display="inline"
                noDecoration
                icon="share"
              >
                <Trans id="contact-book.action.start-discussion">Start discussion FIXME</Trans>
              </Button>
            </Fragment>
          )}
          <div className="s-contact-book-menu__select-all">
            <Checkbox
              checked={count > 0 && count === totalCount}
              indeterminate={count > 0 && count < totalCount}
              onChange={this.handleSelectAllEntitiesChange}
              label={<Trans id="contact-book.action.select-all">Select all contacts</Trans>}
              showLabelforSr={count > 0}
            />
          </div>
        </div>
      </MenuBar>
    );
  }

  renderContacts() {
    const { contacts, hasMore, tagSearched } = this.props;

    return (
      <Fragment>
        <ContactList
          contacts={getFilteredContacts(contacts, tagSearched)}
          sortDir={this.state.sortDir}
          onSelectEntity={this.onSelectEntity}
          selectedContactsIds={this.state.selectedEntitiesIds}
        />
        {hasMore && (
          <div className="s-contact-book-list__load-more">
            <Button shape="hollow" onClick={this.loadMore}>
              <Trans id="general.action.load_more">Load more</Trans>
            </Button>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    const { i18n } = this.props;

    return (
      <div className="s-contact-book">
        <PageTitle title={i18n._('header.menu.contacts', { defaults: 'Contacts' })} />
        {this.renderMenuBar()}
        <SidebarLayout
          sidebar={(
            <div className="s-contact-book__sidebar">
              <div>
                <h2 className="s-contact-book__tags-title"><Trans id="contact-book.contacts.title">Contacts</Trans></h2>
                <NavList dir="vertical">
                  <NavItem>
                    <Button
                      className="s-contact-book__action-button"
                      icon="plus"
                      shape="plain"
                      display="block"
                      onClick={this.handleClickAddContact}
                    >
                      <Trans id="contact-book.action.add">Add</Trans>
                    </Button>
                  </NavItem>
                  <NavItem>
                    <ImportContactButton
                      className="s-contact-book__action-button"
                      onUploadSuccess={this.handleUploadSuccess}
                    />
                  </NavItem>
                </NavList>
              </div>
              <div>
                <h2 className="s-contact-book__tags-title"><Trans id="contact-book.groups.title">Groups</Trans></h2>
                <TagList />
                <NavList dir="vertical">
                  <NavItem>
                    <Button
                      className="s-contact-book__action-button"
                      icon="tag"
                      shape="plain"
                      display="block"
                      onClick={this.handleClickEditGroups}
                    >
                      <Trans id="contact-book.tags.action.edit-groups">Edit groups</Trans>
                    </Button>
                  </NavItem>
                </NavList>
              </div>
            </div>
          )}
        >
          {this.renderContacts()}
        </SidebarLayout>
      </div>
    );
  }
}

export default ContactBook;
