import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import ContactAvatarLetter from '../ContactAvatarLetter';
import DiscussionDraft, { TopRow, BodyRow, BottomRow } from '../DiscussionDraft';
import DiscussionTextarea from '../DiscussionTextarea';
import Dropdown, { withDropdownControl } from '../DropdownMenu';
import VerticalMenu, { VerticalMenuItem } from '../VerticalMenu';
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
        <div className="m-reply__avatar"><ContactAvatarLetter contact={user.contact} /></div>
        <form method="POST" className="m-reply__form">
          <TopRow className="m-reply__top-bar">
            <div className="m-reply__author">{__('me')}</div>
            <div className="m-reply__type">
              <DropdownControl
                toggle="this"
                className=""
                plain
              >
                {__('discussion-item-actions.action.more')} <Icon type="angle-down" className="m-reply__type-ico" spaced />
              </DropdownControl>
              <Dropdown
                id="this"
                position="bottom"
                closeOnClick
              >

                    <Button
                      className="m-discussion-item-actions-container__menu-button"
                      expanded
                    >{__('by email')} <Icon type="email" className="m-reply__type-ico" spaced /></Button>


                    <Button
                      className="m-discussion-item-actions-container__menu-button"
                      expanded
                    >{__('by other protocol')} <Icon type="email" className="m-reply__type-ico" spaced /></Button>


              </Dropdown>

            </div>
            <div className="m-reply__top-actions-switcher">
              <Button
                title={__('more actions')}
              >
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
            <Button className="m-reply__action-button" onClick={this.handleSend}>{__('messages.compose.action.send')}</Button>
            {' '}
            <Button className="m-reply__action-button" onClick={this.handleSave}>{__('messages.compose.action.save')}</Button>
          </BottomRow>
        </form>
      </DiscussionDraft>
    );
  }
}

export default ReplyForm;
