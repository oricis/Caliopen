import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import enableI18n from '../../services/i18n';

const localeSelector = state => state.settings.settings.default_locale;

const mapStateToProps = createSelector(
  [localeSelector],
  locale => ({
    locale,
  })
);

export default compose(
  connect(mapStateToProps),
  enableI18n
)(Presenter);
