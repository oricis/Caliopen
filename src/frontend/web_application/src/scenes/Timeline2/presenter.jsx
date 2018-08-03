import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getClient from '../../services/api-client';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import { Checkbox, Spinner } from '../../components';
import DiscussionItem from './components/DiscussionItem';

import './style.scss';

/**
 * Timeline - Caliopen's Home main component
 * Displays a list of discussions.
 *
 * @extends {Component}
 * @prop {Object} user                - logged user object
 * @prop {function} requestDiscussion - fetch discussions action creator
 * @prop {function} deleteDiscussion  - delete discussion action creator
 * @prop {function} loadMore          - loadMore discussions action creator
 * @prop {array} discussions          - array of discussion object
 * @prop {array} tags                 - array of available tags
 * @prop {boolean} isFetching         - is there an unanswered discussion fetch request ?
 * @prop {boolean} didInvalidate      - is discussion list unvalidated ?
 * @prop {boolean} hasMore            - not all discussions are retrieved
 * @prop {Object} i18n                - internationalisation object provided by lingui-react
 */
class Timeline extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    requestDiscussions: PropTypes.func.isRequired,
    deleteDiscussion: PropTypes.func.isRequired,
    // timelineFilter: PropTypes.string.isRequired,
    loadMore: PropTypes.func.isRequired,
    discussions: PropTypes.arrayOf(PropTypes.shape({})),
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    hasMore: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
    // updateDiscussionTags: PropTypes.func.isRequired,
  };

  static defaultProps = {
    discussions: [],
    tags: [],
    user: undefined,
    isFetching: false,
    didInvalidate: false,
    hasMore: false,
  };

  constructor(props) {
    super(props);
    this.client = getClient();
    this.state = {};
  }

  state = {
    initialized: false,
    selectedMessages: [],
    isTagModalOpen: false,
    isDeleting: false,
  }

  componentWillReceiveProps() {
    const { requestDiscussions, isFetching } = this.props;

    if (!(this.state.initialized || isFetching)) {
      this.setState({ initialized: true });
      requestDiscussions();
    }
  }

  renderDiscussions() {
    const { discussions } = this.props;

    if (discussions) {
      return (
        <ul className="s-discussion-list">
          {discussions.map(discussion => (
            <DiscussionItem key="discussion.discussion_id" discussion={discussion} />
          ))}
        </ul>);
    }

    return (<Spinner isLoading />);
  }

  render() {
    return (
      <section id="discussions" className="s-timeline">
        <StickyNavBar className="action-bar" stickyClassName="sticky-action-bar">
          <header className="s-timeline__action-bar">
            <div className="s-timeline__select-all">
              <Checkbox label="" />
            </div>
          </header>
        </StickyNavBar>
        { this.renderDiscussions() }
      </section>);
  }
}

export default Timeline;
