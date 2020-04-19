import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouteParams } from '../../modules/routing';
import { getMessage, messageSelector as messageSelectorBase } from '../../modules/message';
import Presenter from './presenter';

const messageIdSelector = (state, ownProps) => ownProps.routeParams.messageId;
const messageSelector = (state, ownProps) => createSelector(
  [messageIdSelector],
  (messageId) => messageSelectorBase(state, { messageId })
)(state, ownProps);
const mapStateToProps = createSelector(
  [messageIdSelector, messageSelector],
  (messageId, message) => ({
    messageId,
    message,
  })
);
const mapDispatchToProps = (dispatch) => bindActionCreators({
  getMessage,
}, dispatch);

export default compose(
  withRouteParams(),
  connect(mapStateToProps, mapDispatchToProps)
)(Presenter);
