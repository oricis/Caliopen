import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withI18n } from 'lingui-react';
import { paramsSelector } from '../../../../../../store/selectors/router';
import Presenter from './presenter';

const mapStateToProps = createSelector(
  [paramsSelector],
  params => ({
    term: (params && params.term) || '',
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  push,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withI18n()
)(Presenter);
