import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable'; // https://github.com/dogfessional/react-swipeable
import classnames from 'classnames';
import { v1 as uuidV1 } from 'uuid';
import Button from '../../../../components/Button';
import DropdownMenu, { withDropdownControl } from '../../../../components/DropdownMenu';
import VerticalMenu, { VerticalMenuItem } from '../../../../components/VerticalMenu';
import Modal from '../../../../components/Modal';
import ManageTags from '../ManageTags';
import './style.scss';

const DropdownControl = withDropdownControl(Button);

class DiscussionItemContainer extends Component {
  static propTypes = {
    discussion: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.dropdownId = uuidV1();
  }

  state = {
    isActive: false,
    isSwiped: false,
    isTagModalOpen: false,
  };

  handleOpenTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  }

  handleCloseTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: false,
    }));
  }

  handleSwipeLeft = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: true,
      isSwiped: true,
    }));
  }

  handleSwipeRight = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: prevState.isTagModalOpen === true ? prevState.isActive : false,
      isSwiped: prevState.isTagModalOpen === true ? prevState.isSwiped : false,
    }));
  }

  handleHover = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: prevState.isSwiped ? prevState.isActive : true,
    }));
  }

  handleBlur = () => {
    this.setState((prevState) => {
      const isActive = prevState.isSwiped ? false : prevState.isActive;

      return {
        ...prevState,
        isActive: prevState.isTagModalOpen === true ? isActive : false,
      };
    });
  }

  renderMenuDropdown = () => {
    // FIXME on 320px screens, dropdownmenu's width is 100% (it shouldn't)
    const { __ } = this.props;

    return (
      <DropdownMenu
        id={this.dropdownId}
        position="bottom"
        closeOnClick
        hasTriangle
      >
        <VerticalMenu>
          <VerticalMenuItem>
            <Button
              className="m-discussion-item-container__action-button"
              display="expanded"
            >{__('discussion-item.action.archives')}</Button>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <Button
              className="m-discussion-item-container__action-button"
              display="expanded"
            >{__('discussion-item.action.enable_tracking')}</Button>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <Button
              className="m-discussion-item-container__action-button"
              display="expanded"
              onClick={this.handleOpenTags}
            >{__('discussion-item.action.manage_tags')}</Button>
          </VerticalMenuItem>
        </VerticalMenu>
      </DropdownMenu>
    );
  }

  renderActions= () => {
    const { __ } = this.props;
    const actionsClassName = classnames(
      'm-discussion-item-container__actions',
      { 'm-discussion-item-container__actions--swiped': this.state.isSwiped },
      { 'm-discussion-item-container__actions--hover': this.state.isActive },
    );

    return (
      <div className={actionsClassName}>
        <Button shape="plain" className="m-discussion-item-container__action">{__('discussion-item.action.delete')}</Button>
        <Button shape="plain" className="m-discussion-item-container__action">{__('discussion-item.action.reply')}</Button>
        <Button shape="plain" className="m-discussion-item-container__action">{__('discussion-item.action.forward')}</Button>
        <DropdownControl
          toggle={this.dropdownId}
          className="m-discussion-item-container__action float-right"
          shape="plain"
        >
          {__('discussion-item.action.more')}
        </DropdownControl>
        {this.renderMenuDropdown()}
        {this.renderTagsModal()}
      </div>
    );
  }


  renderTagsModal = () => {
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
        onClose={this.handleCloseTags}
      >
        <ManageTags discussion={discussion} />
      </Modal>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <Swipeable
        onSwipingLeft={this.handleSwipeLeft}
        onSwipingRight={this.handleSwipeRight}
        onMouseOver={this.state.isSwiped ? null : this.handleHover}
        onMouseOut={this.state.isSwiped ? null : this.handleBlur}
        className={classnames(
          'm-discussion-item-container',
          { 'm-discussion-item-container--active': this.state.isActive },
        )}
      >

        {this.renderActions()}
        {children}

      </Swipeable>
    );
  }
}

export default DiscussionItemContainer;
