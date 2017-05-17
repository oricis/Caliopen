import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import BlockList from '../../components/BlockList';
import InfiniteScroll from '../../components/InfiniteScroll';
import DiscussionItem from './components/DiscussionItem';
import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

class DiscussionList extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    requestDiscussions: PropTypes.func.isRequired,
    loadMoreDiscussions: PropTypes.func.isRequired,
    discussions: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: null,
    discussions: [],
    isFetching: false,
    hasMore: false,
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.requestDiscussions();

    this.throttledLoadMore = throttle(
      () => this.props.loadMoreDiscussions(),
      LOAD_MORE_THROTTLE,
      { trailing: false }
    );
  }

  loadMore() {
    if (this.props.hasMore) {
      this.throttledLoadMore();
    }
  }

  render() {
    const { user, discussions, isFetching, hasMore, __ } = this.props;

    return (
      <div>
        <Spinner isLoading={isFetching} />
        {user && (
          <InfiniteScroll onReachBottom={this.loadMore}>
            <BlockList className="s-discussion-list">
              {discussions.map(item => (
                <DiscussionItem key={item.discussion_id} user={user} discussion={item} />
              ))}
            </BlockList>
          </InfiniteScroll>
        )}
        {hasMore && (
          <div className="s-discussion-list__load-more">
            <Button shape="hollow" onClick={this.loadMore}>{__('general.action.load_more')}</Button>
          </div>
        )}
      </div>
    );
  }
}

export default DiscussionList;
