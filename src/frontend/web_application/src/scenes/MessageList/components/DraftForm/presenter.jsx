import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReplyFormBase from '../../../../components/ReplyForm';
import NewDraftForm from '../../../../components/NewDraftForm';

class DraftForm extends Component {
  static propTypes = {
    discussionId: PropTypes.string.isRequired,
    allowEditRecipients: PropTypes.bool,
    message: PropTypes.shape({ }),
    draft: PropTypes.shape({ }),
    requestDraft: PropTypes.func.isRequired,
    editDraft: PropTypes.func.isRequired,
    saveDraft: PropTypes.func.isRequired,
    sendDraft: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
  };

  static defaultProps = {
    allowEditRecipients: false,
    message: {},
    draft: null,
    user: undefined,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    const { discussionId, draft } = this.props;
    if (!draft && discussionId) {
      this.props.requestDraft({ discussionId });
    }
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
    const { saveDraft, discussionId, message } = this.props;
    const params = { draft, discussionId, message };

    return saveDraft(params);
  }

  handleSend({ draft }) {
    const { sendDraft, discussionId, message } = this.props;
    const params = { draft, message, discussionId };

    return sendDraft(params);
  }

  render() {
    const { draft, allowEditRecipients, user } = this.props;

    if (!draft) {
      return (<div />);
    }

    if (allowEditRecipients) {
      return (<NewDraftForm
        draft={draft}
        onChange={this.handleChange}
        onSave={this.handleSave}
        onSend={this.handleSend}
        user={user}
      />);
    }

    return (
      <ReplyFormBase
        draft={draft}
        onChange={this.handleChange}
        onSave={this.handleSave}
        onSend={this.handleSend}
        user={user}
      />
    );
  }
}

export default DraftForm;
