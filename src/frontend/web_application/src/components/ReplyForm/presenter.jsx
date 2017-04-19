import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import Button from '../Button';
import Icon from '../Icon';
import ContactAvatarLetter from '../ContactAvatarLetter';
import Dropdown, { withDropdownControl } from '../Dropdown';
import DiscussionDraft, { TopRow, BodyRow, BottomRow } from '../DiscussionDraft';
import DiscussionTextarea from '../DiscussionTextarea';
import './style.scss';

const DropdownControl = withDropdownControl(Button);

function generateStateFromProps(props) {
  const { draft } = props;

  return { draft };
}

class ReplyForm extends Component {
  static propTypes = {
    draft: PropTypes.shape({}).isRequired,
    onSave: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    user: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    onChange: () => {},
    user: { contact: {} },
  };
  constructor(props) {
    super(props);
    this.state = {
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
    const { draft } = this.state;
    this.props.onSave({ draft });
  }

  handleSend() {
    const { draft } = this.state;
    this.props.onSend({ draft });
  }

  handleChange(ev) {
    const { name, value } = ev.target;

    this.setState((prevState) => {
      const draft = { ...prevState.draft, [name]: value };

      return { draft };
    }, () => {
      this.props.onChange({ draft: this.state.draft });
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
    const typeTranslations = {
      email: __('reply-form.protocol.email'),
    };

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
              <div className="m-reply__author">{__('reply-form.you')}</div>
              <div className="m-reply__type">
                <span className="m-reply__type-label">
                  {__('reply-form.by', { type: typeTranslations[this.state.draft.type] })}
                </span>
                {' '}
                <Icon className="m-reply__type-icon" type={this.state.draft.type} spaced />
                {' '}
                <Icon type="angle-down" spaced />
              </div>
              <div className="m-reply__date">{__('reply-form.now')}</div>
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
              body={this.state.draft.body}
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
