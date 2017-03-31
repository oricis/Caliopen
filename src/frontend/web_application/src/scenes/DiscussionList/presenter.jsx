import React, { Component, PropTypes } from 'react';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import BlockList from '../../components/BlockList';
import DiscussionItem from './components/DiscussionItem';
import './style.scss';

class DiscussionList extends Component {
  static propTypes = {
    requestDiscussions: PropTypes.func.isRequired,
    loadMoreDiscussions: PropTypes.func.isRequired,
    discussions: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
  }

  loadMore() {
    this.props.loadMoreDiscussions();
  }

  render() {
    const { discussions, isFetching, hasMore, __ } = this.props;

    return (
      <div>
        <Spinner isLoading={isFetching} />
        <BlockList
          className="s-discussion-list"
          infinite-scroll={this.loadMore}
        >
          {discussions.map(item => (
            <DiscussionItem key={item.discussion_id} discussion={item} />
          ))}
        </BlockList>
        {hasMore && (
          <div className="s-discussion-list__load-more">
            <Button hollow onClick={this.loadMore}>{__('general.action.load_more')}</Button>
          </div>
        )}
      </div>
    );
  }
}

export default DiscussionList;
