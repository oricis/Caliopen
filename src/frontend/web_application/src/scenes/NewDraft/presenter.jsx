import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { DraftMessage, withCurrentInternalId } from '../../modules/draftMessage';
import { withReplace, withPush } from '../../modules/routing';
import { withCloseTab } from '../../modules/tab';
import './style.scss';

@withReplace()
@withPush()
@withCurrentInternalId()
@withCloseTab()
class NewDraft extends Component {
  static propTypes = {
    internalId: PropTypes.string,
    closeTab: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  static defaultProps = {
    internalId: undefined,
  };

  componentDidMount() {
    return this.eventuallyRedirect(this.props);
  }

  componentDidUpdate() {
    return this.eventuallyRedirect(this.props);
  }

  eventuallyRedirect = (props) => {
    const {
      internalId,
      replace,
    } = props;

    if (!internalId) {
      const newPathname = `/compose/${uuidv4()}`;

      return replace(newPathname);
    }

    return undefined;
  }

  handleSent = ({ message }) => {
    const { push } = this.props;

    return push(`/discussions/${message.discussion_id}`);
  }

  render() {
    const { internalId, closeTab } = this.props;

    if (!internalId) {
      return null;
    }

    return (
      <div className="s-new-draft">
        <DraftMessage
          hasDiscussion={false}
          onDeleteMessageSuccessfull={closeTab}
          onSent={this.handleSent}
        />
      </div>
    );
  }
}

export default NewDraft;
