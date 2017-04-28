import React from 'react';
import { createSelector } from 'reselect';
import { withRouter, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { ComposeButton, CreateContactButton, ComposeContactButton, ReplyButton } from './components';

const applicationSelector = state => state.application.applicationName;

const defaultActionsSelector = createSelector(
  state => state,
  () => ([
    {
      route: '/contacts',
      application: 'contacts',
      children: props => (<CreateContactButton {...props} />),
    },
    {
      route: '/contacts/:contactId',
      disabled: true,
      children: props => (<ComposeContactButton {...props} />),
    },
    {
      route: '/',
      application: 'discussions',
      children: props => (<ComposeButton {...props} />),
    },
    {
      route: '/discussions/:discussionId',
      disabled: true,
      children: props => (<ReplyButton {...props} />),
    },
  ])
);

export const principalActionSelector = createSelector(
  [defaultActionsSelector, applicationSelector, (state, props) => props.location],
  (actions, applicationName, location) => actions.reduce(
    (prev, action) => {
      if (matchPath(location.pathname, { path: action.route })) {
        return action;
      }

      if (!prev && applicationName === action.application) {
        return action;
      }

      return prev;
    },
    undefined)
);

export const availableActionsSelector = createSelector(
  [
    defaultActionsSelector,
    principalActionSelector,
    (state, props) => props.location,
  ],
  (actions, principalAction, location) => actions.filter(
    action => !matchPath(location.pathname, { path: action.route }) &&
      action.application && action !== principalAction
  )
);

const mapStateToProps = (state, props) => ({
  principalAction: principalActionSelector(state, props),
  availableActions: availableActionsSelector(state, props),
});

export default withRouter(connect(mapStateToProps)(Presenter));
