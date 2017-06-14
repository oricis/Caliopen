import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewDraftForm from '../../components/NewDraftForm';

class NewDraft extends Component {
  static propTypes = {
    draft: PropTypes.shape({}),
    requestSimpleDraft: PropTypes.func.isRequired,
    editSimpleDraft: PropTypes.func.isRequired,
    saveDraft: PropTypes.func.isRequired,
    sendDraft: PropTypes.func.isRequired,
  };

  static defaultProps = {
    draft: undefined,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    if (!this.props.draft) {
      this.props.requestSimpleDraft();
    }
  }

  handleChange({ draft }) {
    const { editSimpleDraft } = this.props;

    return editSimpleDraft({ draft });
  }

  handleSave({ draft }) {
    const { saveDraft } = this.props;

    return saveDraft({ draft });
  }

  handleSend({ draft }) {
    const { sendDraft } = this.props;

    return sendDraft({ draft });
  }

  render() {
    const { draft } = this.props;

    return (
      <NewDraftForm
        draft={draft}
        onChange={this.handleChange}
        onSave={this.handleSave}
        onSend={this.handleSend}
      />
    );
  }
}

export default NewDraft;
