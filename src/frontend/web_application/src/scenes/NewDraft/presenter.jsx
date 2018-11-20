import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { DraftMessage } from '../../modules/draftMessage';
import { withPush, withReplace } from '../../modules/routing';
import './style.scss';

@withPush()
@withReplace()
class NewDraft extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    draft: PropTypes.shape({}),
    message: PropTypes.shape({}),
    internalId: PropTypes.string,
    currentTab: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    draft: undefined,
    message: undefined,
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
    const { internalId } = this.props;

    if (!internalId) {
      return null;
    }

    return (
      <div className="s-new-draft">
        <DraftMessage hasDiscussion={false} />
      </div>
    );
  }
}

export default NewDraft;
