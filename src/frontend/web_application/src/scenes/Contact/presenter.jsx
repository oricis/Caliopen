import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import ManageTags from './ManageTags';
import Spinner from '../../components/Spinner';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import Modal from '../../components/Modal';
import MenuBar from '../../components/MenuBar';
import Button from '../../components/Button';
import TextBlock from '../../components/TextBlock';
import DropdownMenu, { withDropdownControl } from '../../components/DropdownMenu';
import VerticalMenu, { VerticalMenuItem } from '../../components/VerticalMenu';
import { UPDATE_CONTACT_SUCCESS } from '../../store/modules/contact';
import './style.scss';

// const FAKE_TAGS = ['Caliopen', 'Gandi', 'Macarons'];
const DropdownControl = withDropdownControl(Button);

const noop = str => str;

class Contact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestContact: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
    notifyError: PropTypes.func.isRequired,
    removeContact: PropTypes.func,
    contactId: PropTypes.string.isRequired,
    contact: PropTypes.shape({}),
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    removeContact: noop,
    contact: undefined,
  };

  constructor(props) {
    super(props);
    this.dropdownId = uuidV1();
  }

  state = {
    isTagsModalOpen: false,
    editMode: false,
  };

  componentDidMount() {
    const { contactId, requestContact } = this.props;
    requestContact({ contactId });
  }

  handleContactChange = ({ contact, original }) => {
    const { __, updateContact, notifyError, requestContact } = this.props;

    updateContact({ contact, original })
      .then((action) => {
        if (action.type === UPDATE_CONTACT_SUCCESS) {
          return requestContact({ contactId: contact.contact_id });
        }

        return notifyError(__('contact.feedback.update-fail'));
      })
    ;
  }

  handleContactDelete = ({ contact }) => {
    this.props.removeContact({ contact });
  }

  openTagsModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagsModalOpen: true,
    }));
  }

  closeTagsModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagsModalOpen: false,
    }));
  }

  toggleEditMode = () => {
    this.setState(prevState => ({
      ...prevState,
      editMode: !prevState.editMode,
    }));
  }

  renderTagsModal = () => {
    const { contact, updateContact, __ } = this.props;
    const count = contact.tags ? contact.tags.length : 0;
    const title = (
      <span>{__('tags.header.title')}
        <span className="m-tags-form__count">
          {__('tags.header.count', { count }) }
        </span>
      </span>);

    return (
      <Modal
        isOpen={this.state.isTagsModalOpen}
        contentLabel={__('tags.header.title')}
        title={title}
        onClose={this.closeTagsModal}
      >
        <ManageTags contact={contact} onContactChange={updateContact} />
      </Modal>
    );
  }

  renderEditBar = () => {
    const { __ } = this.props;

    return (
      <div className="s-contact__edit-bar">
        <Button
          onClick={this.toggleEditMode}
          responsive="icon-only"
          icon="remove"
          className="s-contact__action"
        >Cancel</Button>
        <TextBlock className="s-contact__bar-title">
          {__('Editing contact')}
        </TextBlock>
        <Button
          onClick={this.toggleEditMode}
          responsive="icon-only"
          icon="check"
          className="s-contact__action"
        >Validate</Button>
      </div>
    );
  }

  renderActionBar = () => {
    const { contact } = this.props;

    return (
      <div className="s-contact__action-bar">
        <TextBlock className="s-contact__bar-title">
          {contact.title}
        </TextBlock>
        <DropdownControl
          toggle={this.dropdownId}
          className="s-contact__actions-switcher float-right"
          icon="ellipsis-v"
        />

        <DropdownMenu
          id={this.dropdownId}
          className="s-contact__actions-menu"
          position="bottom"
          closeOnClick
        >
          <VerticalMenu>
            <VerticalMenuItem>
              <Button
                onClick={this.toggleEditMode}
                className="s-contact__action"
                display="expanded"
              >Edit</Button>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <Button
                onClick={this.openTagsModal}
                className="s-contact__action"
                display="expanded"
              >Manage Tags</Button>
              {
                // FIXME: when you open tagsModal, and then close it,
                // Dropdown bugs.
                this.renderTagsModal()
              }
            </VerticalMenuItem>
            <VerticalMenuItem>
              <Button
                onClick={this.openTagsModal}
                className="s-contact__action"
                display="expanded"
              >Share</Button>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <Button
                onClick={this.handleContactDelete}
                className="s-contact__action"
                display="expanded"
              >Delete</Button>
            </VerticalMenuItem>
          </VerticalMenu>
        </DropdownMenu>
      </div>
    );
  }

  render() {
    const { __, isFetching, contact } = this.props;

    return (
      <div>
        {contact && (
          <MenuBar className="s-contact__menu-bar">
            {
              // FIXME: edit and action bars be displayed in fixed Header,
              // not in MenuBar
            }
            {this.state.editMode ? this.renderEditBar() : this.renderActionBar()}
          </MenuBar>
        )}

        <Spinner isLoading={isFetching} />

        {contact && (
          <div className="s-contact">
            <div className="s-contact__col-datas-irl">
              <ContactProfile
                contact={contact}
                onChange={this.handleContactChange}
                editMode={this.state.editMode}
              />
            </div>
            <div className="s-contact__col-datas-online">
              <ContactDetails
                contact={contact}
                onUpdateContact={this.handleContactChange}
                editMode={this.state.editMode}
                __={__}
              />
            </div>
          </div>
          )}
      </div>
    );
  }
}

export default Contact;
