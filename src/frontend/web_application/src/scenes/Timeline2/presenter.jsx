import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getClient from '../../services/api-client';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import { Checkbox, Spinner } from '../../components';
import DiscussionItem from './components/DiscussionItem';

import './style.scss';

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
