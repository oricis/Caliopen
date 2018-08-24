import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { Trans } from 'lingui-react';
import getClient from '../../services/api-client';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import { Button, Checkbox, InfiniteScroll, Spinner } from '../../components';
import DiscussionItem from './components/DiscussionItem';

import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

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

  componentDidMount() {
    this.throttledLoadMore = throttle(
      () => this.props.loadMore(),
      LOAD_MORE_THROTTLE,
      { trailing: false }
    );
  }

  componentWillReceiveProps() {
    const { requestDiscussions, isFetching } = this.props;

    if (!(this.state.initialized || isFetching)) {
      this.setState({ initialized: true });
      requestDiscussions();
    }
  }

  loadMore = () => {
    if (this.props.hasMore) {
      this.throttledLoadMore();
    }
  }

  renderDiscussions() {
    const { discussions, user } = this.props;

    if (discussions) {
      return (
        <ul className="s-discussion-list">
          {discussions.map(discussion => (
            <DiscussionItem key={discussion.discussion_id} user={user} discussion={discussion} />
          ))}
        </ul>);
    }

    return (<Spinner isLoading />);
  }

  render() {
    const { hasMore } = this.props;

    return (
      <Fragment>
        <section id="discussions" className="s-timeline">
          <StickyNavBar className="s-timeline__action-bar" stickyClassName="sticky">
            <header className="s-timeline__actions">
              <div className="s-timeline__select-all">
                <Checkbox label="" />
              </div>
            </header>
          </StickyNavBar>
          <InfiniteScroll onReachBottom={this.loadMore}>
            { this.renderDiscussions() }
          </InfiniteScroll>
        </section>
        {hasMore && (
          <div className="s-timeline__load-more">
            <Button shape="hollow" onClick={this.loadMore}><Trans id="general.action.load_more">Load more</Trans></Button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default Timeline;
