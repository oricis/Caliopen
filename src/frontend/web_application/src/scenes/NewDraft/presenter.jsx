import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { DraftMessage, withCurrentInternalId } from '../../modules/draftMessage';
import { withReplace } from '../../modules/routing';
import { withCloseTab } from '../../modules/tab';
import './style.scss';

@withReplace()
@withCurrentInternalId()
@withCloseTab()
class NewDraft extends Component {
  static propTypes = {
    internalId: PropTypes.string,
    closeTab: PropTypes.func.isRequired,
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

  render() {
    const { internalId, closeTab } = this.props;

    if (!internalId) {
      return null;
    }

    return (
      <div className="s-new-draft">
        <DraftMessage hasDiscussion={false} onDeleteMessageSuccessfull={closeTab} />
      </div>
    );
  }
}

export default NewDraft;
