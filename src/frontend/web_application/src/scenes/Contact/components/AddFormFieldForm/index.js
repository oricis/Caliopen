import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { arrayPush } from 'redux-form';
import Presenter from './presenter';

const formSelector = state => state.form;
const formNameSelector = (state, ownProps) => ownProps.form;

const mapStateToProps = createSelector(
  [formSelector, formNameSelector],
  (formState, formName) => ({
    formValues: formState[formName].values,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  addField: arrayPush,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
