import { bindActionCreators, compose } from 'redux';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { updateMessage } from '../../../../store/modules/message';
import { requestTags } from '../../../../store/modules/tag';
import Presenter from './presenter';

const tagSelector = state => state.tag;

const mapStateToProps = createSelector(
  [tagSelector],
  ({ tags }) => ({ tags })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  updateMessage,
  requestTags,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Presenter);
