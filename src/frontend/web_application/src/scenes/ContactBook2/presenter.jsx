import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import ContactList from './components/ContactList';
import { PageTitle, Spinner, Button, MenuBar, Checkbox, SidebarLayout, Modal, NavList, NavItem } from '../../components';
import { withPush } from '../../modules/routing';
import TagList from './components/TagList';
import ImportContact from './components/ImportContact';
import './style.scss';
import './contact-book-menu.scss';

export const SORT_VIEW_GIVEN_NAME = 'given_name';
export const SORT_VIEW_FAMILY_NAME = 'family_name';
export const SORT_VIEW_TITLE = 'title';
export const DEFAULT_SORT_VIEW = SORT_VIEW_GIVEN_NAME;

const DEFAULT_SORT_DIR = 'ASC';

function getFilteredContacts(contactList, activeTag) {
  if (activeTag === '') {
    return contactList;
  }

  return contactList.filter(contact => contact.tags && contact.tags.includes(activeTag));
}

@withPush()
class ContactBook extends Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    requestContacts: PropTypes.func.isRequired,
    loadMoreContacts: PropTypes.func.isRequired,
    contacts: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    contacts: [],
    isFetching: false,
    hasMore: false,
  };

  state = {
    activeTag: '',
    sortDir: DEFAULT_SORT_DIR,
    isImportModalOpen: false,
  };

  componentDidMount() {
    this.props.requestContacts();
  }

  loadMore = () => {
    this.props.loadMoreContacts();
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

  handleTagClick = (tagName) => {
    this.setState({
      activeTag: tagName,
    });
  };

  handleSortDirChange = (event) => {
    this.setState({
      sortDir: event.target.value,
    });
  };

  handleOpenImportModal = () => {
    this.setState({
      isImportModalOpen: true,
    });
  };

  handleCloseImportModal = () => {
    this.setState({
      isImportModalOpen: false,
    });
  };

  renderImportModal = () => {
    const { i18n } = this.props;

    return (
      <Modal
        isOpen={this.state.isImportModalOpen}
        contentLabel={i18n._('import-contact.action.import_contacts', { defaults: 'Import contacts' })}
        title={i18n._('import-contact.action.import_contacts', { defaults: 'Import contacts' })}
        onClose={this.handleCloseImportModal}
      >
        <ImportContact
          onCancel={this.handleCloseImportModal}
          onUploadSuccess={this.handleUploadSuccess}
        />
      </Modal>
    );
  }

  renderContacts() {
    const { contacts, hasMore } = this.props;

    return (
      <Fragment>
        <ContactList
          contacts={getFilteredContacts(contacts, this.state.activeTag)}
          sortDir={this.state.sortDir}
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
    const {
      isFetching, i18n,
    } = this.props;

    return (
      <div className="s-contact-book">
        <PageTitle title={i18n._('header.menu.contacts', { defaults: 'Contacts' })} />
        <MenuBar className="s-contact-book-menu">
          {isFetching && (
            <div className="s-contact-book-menu__loading">
              <Spinner isLoading={isFetching} display="inline" />
            </div>
          )}
          <div className="s-contact-book-menu__selector">
            220 contacts sélectionnés : <Button className="s-contact-book-menu__action-btn" display="inline" icon="trash" noDecoration>Supprimer</Button> <Button className="s-contact-book-menu__action-btn" display="inline" icon="share" noDecoration>Commencer une discussion</Button> <Checkbox className="s-contact-book__select-all" />
          </div>
        </MenuBar>
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
                    <Button
                      icon="upload"
                      className="s-contact-book__action-button"
                      shape="plain"
                      display="block"
                      onClick={this.handleOpenImportModal}
                    >
                      <Trans id="contact-book.action.import">Import</Trans>
                    </Button>
                    {this.renderImportModal()}
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
