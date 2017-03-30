import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import ContactAvatarLetter from '../ContactAvatarLetter';
import DiscussionDraft, { TopRow, BodyRow, BottomRow } from '../DiscussionDraft';
import DiscussionTextarea from '../DiscussionTextarea';
import './style.scss';

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

    return (
      <DiscussionDraft className="m-reply">
        <div className="m-reply__avatar"><ContactAvatarLetter contact={user.contact} /></div>
        <form method="POST" className="m-reply__form">
          <TopRow className="m-reply__top-bar">
            <div className="m-reply__top-bar-info">
              <span className="m-reply__author">{__('You')}</span>
              <Button className="m-reply__type-selector" disabled>
                {__('by')} {__(this.state.protocol)} <Icon type="angle-down" spaced />
              </Button>
            </div>

            <div className="m-reply__top-actions-switcher">
              <Button onClick={this.handleActiveClick}>
                <Icon type="ellipsis-v" />
              </Button>
            </div>
          </TopRow>
          <BodyRow className="m-reply__body">
            <DiscussionTextarea
              body={this.state.draftMessage.body}
              onChange={this.handleChange}
              __={__}
            />
          </BodyRow>
          <BottomRow className="m-reply__bottom-bar">
            <div className="m-reply__actions">
              <Button className="m-reply__action-button" onClick={this.handleSend}><Icon type="send" spaced /> {__('messages.compose.action.send')}</Button>
              <Button className="m-reply__action-button" onClick={this.handleSave}><Icon type="save" spaced /> {__('messages.compose.action.save')}</Button>
              <Button className="m-reply__action-button"><Icon type="share-alt" spaced /> {__('messages.compose.action.copy')}</Button>
            </div>

            <div className="m-reply__editor">
              <Button className="m-reply__action-button" onClick={this.handleSave}><Icon type="editor" /></Button>
            </div>
          </BottomRow>
        </form>
      </DiscussionDraft>
    );
  }
}

export default ReplyForm;
