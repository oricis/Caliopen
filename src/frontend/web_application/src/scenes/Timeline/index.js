import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { withUser } from '../../hoc/user';
import Presenter from './presenter';
import { filterTimeline } from '../../store/actions/timeline';
import { loadMore, hasMore } from '../../store/modules/message';
import { timelineFilterSelector } from '../../store/selectors/timeline';

const timelineSelector = createSelector([
  state => state.message.messagesCollections.timeline,
  timelineFilterSelector,
], (collection, timelineFilter) => collection && collection[timelineFilter]);
const messagesSelector = state => state.message.messagesById;

const mapStateToProps = createSelector(
  [timelineSelector, messagesSelector, timelineFilterSelector],
  (timeline, messagesById, timelineFilter) => ({
    messages: timeline && timeline.messages.map(id => messagesById[id])
      .sort((a, b) => new Date(b.date_insert) - new Date(a.date_insert)),
    hasMore: timeline && hasMore(timeline),
    isFetching: timeline && timeline.isFetching,
    didInvalidate: timeline && timeline.didInvalidate,
    timelineFilter,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestMessages: filterTimeline,
  loadMore: loadMore.bind(null, 'timeline', '0'),
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUser(),
  withTranslator()
)(Presenter);
