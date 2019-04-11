import { Component } from 'react';
import PropTypes from 'prop-types';

class WithDraftMessage extends Component {
  static propTypes = {
    hasDiscussion: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    internalId: PropTypes.string.isRequired,
    messageId: PropTypes.string,
    draftMessage: PropTypes.shape({}),
    original: PropTypes.shape({}),
    requestDraft: PropTypes.func.isRequired,
    isRequestingDraft: PropTypes.bool,
    isDeletingDraft: PropTypes.bool,
  };

  static defaultProps = {
    draftMessage: undefined,
    original: undefined,
    messageId: undefined,
    isRequestingDraft: false,
    isDeletingDraft: false,
  };

  state = {};

  componentDidMount() {
    const {
      draftMessage, isRequestingDraft, isDeletingDraft, requestDraft, internalId, hasDiscussion,
      messageId,
    } = this.props;

    if (!draftMessage && !isRequestingDraft && !isDeletingDraft) {
      requestDraft({ internalId, hasDiscussion, messageId });
    }
  }

  render() {
    const {
      render, requestDraft, draftMessage, original, isRequestingDraft, isDeletingDraft,
    } = this.props;

    return render({
      requestDraft, draftMessage, original, isRequestingDraft, isDeletingDraft,
    });
  }
}

export default WithDraftMessage;
