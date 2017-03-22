import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import ContactAvatarLetter from '../ContactAvatarLetter';
import DiscussionDraft, { TopRow, BodyRow } from '../DiscussionDraft';
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

  render() {
    const { user, __ } = this.props;

    return (
      <DiscussionDraft className="m-reply">
        <form method="POST">
          <TopRow className="m-reply__action-bar">
            <Button className="m-reply__action-button" onClick={this.handleSend}>{__('messages.compose.action.send')}</Button>
            {' '}
            <Button className="m-reply__action-button" onClick={this.handleSave}>{__('messages.compose.action.save')}</Button>
          </TopRow>
          <BodyRow className="m-reply__content">
            <div className="m-reply__avatar"><ContactAvatarLetter contact={user.contact} /></div>
            <div className="m-reply__body">
              <DiscussionTextarea
                body={this.state.draftMessage.body}
                onChange={this.handleChange}
                __={__}
              />
            </div>
          </BodyRow>
        </form>
      </DiscussionDraft>
    );
  }
}

export default ReplyForm;
