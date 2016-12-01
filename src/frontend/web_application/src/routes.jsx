import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Page from './components/Page';
import DiscussionList from './scenes/DiscussionList';
import ContactList from './scenes/ContactList';
import enableI18n from './services/i18n';

const getRoutes = () => (
  <Route name="app" path="/" component={enableI18n(Page)} >
    <IndexRoute component={DiscussionList} />
    <Route path="contacts" component={ContactList} />
  </Route>
);

export default getRoutes;
