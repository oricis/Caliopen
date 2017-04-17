import React, { Component, PropTypes } from 'react';
import ReplyFormBase from '../../../../components/ReplyForm';

class ReplyForm extends Component {
  static propTypes = {
    discussionId: PropTypes.string.isRequired,
    message: PropTypes.shape({ }),
    draft: PropTypes.shape({ }),
    requestDraft: PropTypes.func.isRequired,
    editDraft: PropTypes.func.isRequired,
    saveDraft: PropTypes.func.isRequired,
    sendDraft: PropTypes.func.isRequired,
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

  componentWillMount() {
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
    const { draft } = this.props;

    if (!draft) {
      return (<div />);
    }

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
