import React, { Component, PropTypes } from 'react';
import ReplyFormBase from '../../../../components/ReplyForm';

class ReplyForm extends Component {
  static propTypes = {
    discussionId: PropTypes.string.isRequired,
    message: PropTypes.shape({ }),
    draft: PropTypes.shape({ }),
    requestDraft: PropTypes.func.isRequired,
    editDraft: PropTypes.func.isRequired,
    updateMessage: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    message: {},
    draft: null,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.draft) {
      const { discussionId } = this.props;
      this.props.requestDraft({ discussionId });
    }
  }

  handleChange({ draft }) {
    const { editDraft, discussionId, message } = this.props;
    const params = { draft, discussionId, message };

    return editDraft(params);
  }

  handleSave({ draft }) {
    const { updateMessage, discussionId } = this.props;
    const message = draft;
    const params = { message, discussionId };

    return updateMessage(params);
  }

  handleSend({ message }) {
    const { sendMessage, discussionId } = this.props;
    const params = { message, discussionId };

    return sendMessage(params);
  }

  render() {
    const { draft } = this.props;

    return (
      <ReplyFormBase
        draft={draft}
        onChange={this.handleChange}
        onSave={this.handleSave}
        onSend={this.handleSend}
      />
    );
  }
}

export default ReplyForm;
