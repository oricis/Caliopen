import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { requestTags, createTag, updateTag } from '../../store/modules/tag';
import Presenter from './presenter';

const tagsSelector = state => state.tag;
const mapStateToProps = createSelector(
  [tagsSelector],
  ({ tags, isFetching }) => ({ tags, isFetching })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestTags,
  createTag,
  updateTag,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withI18n()
)(Presenter);
