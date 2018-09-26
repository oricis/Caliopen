import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { Trans } from 'lingui-react';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import { Button, InfiniteScroll, Spinner } from '../../components';
import DiscussionItem from './components/DiscussionItem';
import DiscussionSelector from './components/DiscussionSelector';

import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

class Timeline extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    getUser: PropTypes.func.isRequired,
    isUserFetching: PropTypes.bool.isRequired,
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
    user: {},
    isFetching: false,
    didInvalidate: false,
    hasMore: false,
  };

  state = {
    initialized: false,
    selectedDiscussions: [],
    isTagModalOpen: false,
    isDeleting: false,
  };

  componentDidMount() {
    const { user, isUserFetching, getUser } = this.props;

    if (!(user || isUserFetching)) {
      getUser();
    }

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

  onSelectDiscussion = (type, discussionId) => {
    if (type === 'add') {
      this.setState(prevState => ({
        ...prevState,
        selectedDiscussions: [...prevState.selectedDiscussions, discussionId],
      }));
    }

    if (type === 'remove') {
      this.setState(prevState => ({
        ...prevState,
        selectedDiscussions: [...prevState.selectedDiscussions]
          .filter(item => item !== discussionId),
      }));
    }
  };

  onSelectAllDiscussions = (type) => {
    if (type === 'select') {
      const { discussions } = this.props;

      this.setState(prevState =>
        ({
          ...prevState,
          selectedDiscussions:
            discussions.map(discussion => discussion.discussion_id),
        }));
    }

    if (type === 'unselect') {
      this.setState(prevState => ({ ...prevState, selectedDiscussions: [] }));
    }
  };

  loadMore = () => {
    if (this.props.hasMore) {
      this.throttledLoadMore();
    }
  };

  renderDiscussions() {
    const { discussions, user } = this.props;
    const { selectedDiscussions } = this.state;

    if (discussions) {
      return (
        <ul className="s-discussion-list">
          {discussions.map(discussion => (
            <DiscussionItem
              key={discussion.discussion_id}
              user={user}
              discussion={discussion}
              onSelectDiscussion={this.onSelectDiscussion}
              onSelectAllDiscussions={this.onSelectAllDiscussions}
              isDiscussionSelected={selectedDiscussions.includes(discussion.discussion_id)}
            />
          ))}
        </ul>);
    }

    return (<Spinner isLoading />);
  }

  render() {
    const { hasMore, discussions } = this.props;
    const nbSelectedDiscussions = this.state.selectedDiscussions.length;

    return (
      <Fragment>
        <section id="discussions" className="s-timeline">
          <StickyNavBar className="s-timeline__action-bar" stickyClassName="sticky">
            <DiscussionSelector
              count={nbSelectedDiscussions}
              checked={nbSelectedDiscussions > 0
                && nbSelectedDiscussions === discussions.length}
              totalCount={discussions.length}
              onSelectAllDiscussions={this.onSelectAllDiscussions}
              onEditTags={this.handleOpenTags}
              onDeleteDiscussions={this.handleDeleteDiscussions}
              isDeleting={this.state.isDeleting}
              indeterminate={nbSelectedDiscussions > 0
                && nbSelectedDiscussions < discussions.length}
            />
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
