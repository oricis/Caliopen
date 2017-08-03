import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManageTags from './ManageTags';
import Spinner from '../../components/Spinner';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import Modal from '../../components/Modal';
import MenuBar from '../../components/MenuBar';
import Button from '../../components/Button';
import TextBlock from '../../components/TextBlock';

import './style.scss';

const noop = str => str;

class Contact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestContact: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
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

  state = {
    isTagsModalOpen: false,
    editMode: false,
  };

  componentDidMount() {
    const { contactId, requestContact } = this.props;
    requestContact({ contactId });
  }

  handleContactChange = ({ contact, original }) => {
    this.props.updateContact({ contact, original });
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
        isOpen={this.state.isTagModalOpen}
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
        <TextBlock className="s-contact__bar-title">
          {__('Editing contact')}
        </TextBlock>
        <Button
          onClick={this.toggleEditMode}
          responsive="icon-only"
          icon="check"
          className="s-contact__action"
        />
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
        <Button
          onClick={this.toggleEditMode}
          responsive="icon-only"
          icon="pencil"
          className="s-contact__action"
        />
      </div>
    );
  }

  render() {
    const { __, isFetching, contact } = this.props;

    return (
      <div className="s-contact">
        {contact && (
          <MenuBar className="s-contact__menu-bar">
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
