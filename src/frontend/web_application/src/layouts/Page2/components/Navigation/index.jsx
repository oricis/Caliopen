import React from 'react';
import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { locationSelector } from '../../../../store/selectors/router';
import { RoutingConsumer } from '../../../../modules/routing';
import { withTabs } from './withTabs';

const mapStateToProps = createSelector(
  [locationSelector],
  location => ({
    location,
  })
);

const withRoutes = () => C => props => (
  <RoutingConsumer
    render={({ routes }) => (
      <C routes={routes} {...props} />
    )}
  />
);

export default compose(
  withTabs(),
  withRoutes(),
  connect(mapStateToProps),
)(Presenter);
