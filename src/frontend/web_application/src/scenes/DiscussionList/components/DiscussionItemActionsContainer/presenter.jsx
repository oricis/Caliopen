import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { v1 as uuidV1 } from 'uuid';
import Button from '../../../../components/Button';
import DropdownMenu, { withDropdownControl } from '../../../../components/DropdownMenu';
import VerticalMenu, { VerticalMenuItem } from '../../../../components/VerticalMenu';
import Modal from '../../../../components/Modal';
import ManageTags from '../ManageTags';
import './style.scss';

const DropdownControl = withDropdownControl(Button);

class DiscussionItemActionsContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    discussion: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isTagModalOpen: false,
    };
    this.handleHover = this.handleHover.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClickTags = this.handleClickTags.bind(this);
    this.handleCloseTagsModal = this.handleCloseTagsModal.bind(this);
    this.dropdownId = uuidV1();
  }

  handleHover() {
    this.setState({
      isActive: true,
    });
  }

  handleBlur() {
    this.setState((prevState) => {
      const isActive = prevState.isTagModalOpen === true ? prevState.isActive : false;

      return { isActive };
    });
  }

  handleClickTags() {
    this.setState({ isTagModalOpen: true });
  }

  handleCloseTagsModal() {
    this.setState({ isTagModalOpen: false });
  }

  renderActions() {
    const { __ } = this.props;

    return (
      <div
        className={classnames('m-discussion-item-actions-container__actions', { 'm-discussion-item-actions-container--active__actions': this.state.isActive })}
      >
        <Button shape="plain" className="m-discussion-item-actions-container__action">{__('Delete')}</Button>
        <Button shape="plain" className="m-discussion-item-actions-container__action">{__('Reply')}</Button>
        <Button shape="plain" className="m-discussion-item-actions-container__action">{__('Forward')}</Button>
        <DropdownControl
          toggle={this.dropdownId}
          className="m-discussion-item-actions-container__action float-right"
          shape="plain"
        >
          {__('discussion-item-actions.action.more')}
        </DropdownControl>
        <DropdownMenu
          id={this.dropdownId}
          position="bottom"
          closeOnClick
          hasTriangle
        >
          <VerticalMenu className="m-discussion-item-actions-container__menu">
            <VerticalMenuItem>
              <Button
                className="m-discussion-item-actions-container__menu-button"
                display="expanded"
              >{__('Archive')}</Button>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <Button
                className="m-discussion-item-actions-container__menu-button"
                display="expanded"
              >{__('Enable tracking')}</Button>
            </VerticalMenuItem>
            <VerticalMenuItem>
              <Button
                className="m-discussion-item-actions-container__menu-button"
                display="expanded"
                onClick={this.handleClickTags}
              >{__('Manage tags')}</Button>
            </VerticalMenuItem>
          </VerticalMenu>
        </DropdownMenu>
      </div>
    );
  }

  renderTagsModal() {
    const { discussion, __ } = this.props;
    const count = discussion.tags ? discussion.tags.length : 0;
    const title = [
      __('tags.header.title'),
      (<span key="1" className="m-tags-form__count">{__('tags.header.count', { count }) }</span>),
    ];

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={__('tags.header.title')}
        title={title}
        onClose={this.handleCloseTagsModal}
      >
        <ManageTags discussion={discussion} />
      </Modal>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <div
        className={classnames('m-discussion-item-actions-container', { 'm-discussion-item-actions-container--active': this.state.isActive })}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleBlur}
      >
        <div
          className={classnames('m-discussion-item-actions-container__content', { 'm-discussion-item-actions-container--active__content': this.state.isActive })}
        >
          {children}
        </div>
        {this.state.isActive && this.renderActions()}
        {this.renderTagsModal()}
      </div>
    );
  }
}

export default DiscussionItemActionsContainer;
