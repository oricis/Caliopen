import React, { Component, PropTypes } from 'react';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import BlockList from '../../components/BlockList';
import DiscussionItem from './components/DiscussionItem';
import './style.scss';

/* eslint-disable */
const getMocks = () => ({
  discussions: [
    {"thread": {"tags": [{ tag_id: 'foo-bar-1', name: 'robot'}, { tag_id: 'foo-bar-2', name: 'work'}], "text": "<p>It's okay, Bender. I like cooking too. You, minion. Lift my arm. AFTER H=\r\nIM! I don't know what you did, Fry, but once again, you screwed up! Now all\r\nthe planets are gonna start cracking wise abo", "date_update": null, "privacy_index": 1, "contacts": [{"type": "to", "contact_id": "1039cdcc-1f6f-4b5d-9c8a-5d7c711f357f", "address": "test@caliopen.local"}, {"type": "from", "contact_id": "0ba2e346-e4f8-4c45-9adc-eeb1d42f07e0", "address": "zoidberg@caliopen.local"}], "date_insert": "2016-05-09T15:01:42.588000", "thread_id": "cd53e13a-267d-4d9c-97ee-d0fc59c64200", "total_count": 1, "attachment_count": 0, "importance_level": 0, "unread_count": 1}},
    {"thread": {"tags": [{ tag_id: 'foo-bar-3', name: 'best quotes'}, { tag_id: 'foo-bar-4', name: 'lolilol'}], "text": "Shut up and take my money! Leela, are you alright? You got wanged on the he=\r\nad. Bender, you risked your life to save me! Spare me your space age techno=\r\nbabble, Attila the Hun! Now that the, uh, ga", "date_update": null, "privacy_index": 25, "contacts": [{"type": "to", "contact_id": "1039cdcc-1f6f-4b5d-9c8a-5d7c711f357f", "address": "test@caliopen.local"}, {"type": "from", "contact_id": "0ba2e346-e4f8-4c45-9adc-eeb1d42f07e0", "address": "zoidberg@caliopen.local"}], "date_insert": "2016-05-09T15:01:42.489000", "thread_id": "46d30c27-6cd8-407b-8536-fda4196c20ca", "total_count": 2, "attachment_count": 0, "importance_level": 0, "unread_count": 2}},
  ]
});
/* eslint-enable */

class Discussions extends Component {
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
    this.state = { mockedDiscussions: [] };
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.requestDiscussions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.discussions.length === 0) {
      this.setState({ mockedDiscussions: getMocks().discussions });
    }
  }

  loadMore() {
    this.props.loadMoreDiscussions();
  }

  render() {
    const { discussions, isFetching, hasMore, __ } = this.props;

    const displayedDiscussions = (discussions.length === 0) ?
      this.state.mockedDiscussions :
      discussions;

    return (
      <div>
        <Spinner isLoading={isFetching} />
        <BlockList
          className="s-discussion-list"
          infinite-scroll={this.loadMore}
        >
          {displayedDiscussions.map(item => (
            <DiscussionItem key={item.thread.thread_id} discussion={item.thread} />
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

export default Discussions;
