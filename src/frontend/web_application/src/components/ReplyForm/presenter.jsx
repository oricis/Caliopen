import React, { Component, PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import Button from '../Button';
import Icon from '../Icon';
import ContactAvatarLetter from '../ContactAvatarLetter';
import Dropdown, { withDropdownControl } from '../Dropdown';
import DiscussionDraft, { TopRow, BodyRow, BottomRow } from '../DiscussionDraft';
import DiscussionTextarea from '../DiscussionTextarea';
import './style.scss';

const DropdownControl = withDropdownControl(Button);

function generateStateFromProps(props, prevState) {
  return {
    draftMessage: {
      ...prevState.draftMessage,
      ...props.draftMessage,
    },
  };
}

class ReplyForm extends Component {
  static propTypes = {
    draftMessage: PropTypes.shape({}),
    onSave: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    user: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    draftMessage: {},
    onChange: () => {},
    user: { contact: {} },
  };
  constructor(props) {
    super(props);
    this.state = {
      draftMessage: {},
      isActive: true,
      protocol: 'email',
    };
    this.handleSend = this.handleSend.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  handleSave() {
    this.props.onSave(this.state.draftMessage);
  }

  handleSend() {
    this.props.onSend(this.state.draftMessage);
  }

  handleChange(ev) {
    const { name, value } = ev.target;

    this.setState((prevState) => {
      const draftMessage = { ...prevState.draftMessage, [name]: value };
      this.props.onChange({ draftMessage });

      return { draftMessage };
    });
  }

  handleActiveClick() {
    this.setState(prevState => ({
      isActive: !prevState.isActive,
    }));
  }

  render() {
    const { user, __ } = this.props;
    const dropdownId = uuidV1();

    return (
      <DiscussionDraft className="m-reply">
        <div className="m-reply__avatar-col">
          <ContactAvatarLetter
            contact={user.contact}
            className="m-reply__avatar"
          />
        </div>
        <form method="POST" className="m-reply__form-col">
          <TopRow className="m-reply__top-bar">
            <div className="m-reply__top-bar-info">
              <div className="m-reply__author">{__('You')}</div>
              <div className="m-reply__type">
                <span className="m-reply__type-label">{__('by')} {__(this.state.protocol)}</span>
                {' '}
                <Icon className="m-reply__type-icon" type={__(this.state.protocol)} spaced /> <Icon type="angle-down" spaced /></div>
              <div className="m-reply__date">{__('Now')}</div>
            </div>

            <DropdownControl toggle={dropdownId} className="m-reply__top-actions-switcher">
              <Icon type="ellipsis-v" />
            </DropdownControl>

            <Dropdown
              id={dropdownId}
              className="m-reply__top-actions-menu"
              position="left"
              closeOnClick
            />
          </TopRow>
          <BodyRow className="m-reply__body">
            <DiscussionTextarea
              body={this.state.draftMessage.body}
              onChange={this.handleChange}
              __={__}
            />
          </BodyRow>
          <BottomRow className="m-reply__bottom-bar">
            <div className="m-reply__bottom-actions">
              <div className="m-reply__bottom-action">
                <Button plain onClick={this.handleSend}>
                  <Icon type="send" spaced />
                  <span>{__('messages.compose.action.send')}</span>
                </Button>
              </div>
              <div className="m-reply__bottom-action">
                <Button onClick={this.handleSave}>
                  <Icon type="save" spaced />
                  <span>{__('messages.compose.action.save')}</span>
                </Button>
              </div>
              <div className="m-reply__bottom-action">
                <Button onClick={this.handleSave}>
                  <Icon type="share-alt" spaced />
                  <span>{__('messages.compose.action.copy')}</span>
                </Button>
              </div>
              <div className="m-reply__bottom-action m-reply__bottom-action--editor">
                <Button><Icon type="editor" spaced /></Button>
              </div>
            </div>
          </BottomRow>
        </form>
      </DiscussionDraft>
    );
  }
}

export default ReplyForm;
