import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Page from './layouts/Page';
import AuthPage from './layouts/AuthPage';
import Settings from './layouts/Settings';
import DiscussionList from './scenes/DiscussionList';
import MessageList from './scenes/MessageList';
import ContactBook from './scenes/ContactBook';
import Account from './scenes/Account';
import Signin from './scenes/Signin';
import Signup from './scenes/Signup';
import Tags from './scenes/Tags';
import Devices, { Device } from './scenes/Devices';
import enableI18n from './services/i18n';

const I18nAuthPage = enableI18n(AuthPage);
const I18nPage = enableI18n(Page);

const Routes = () => (
  <Switch>
    <Route path="/auth">
      <I18nAuthPage>
        <Switch>
          <Route exact path="/auth/"><Redirect to="signin" /></Route>
          <Route path="/auth/signin" component={Signin} />
          <Route path="/auth/signup" component={Signup} />
        </Switch>
      </I18nAuthPage>
    </Route>
    <Route path="/">
      <I18nPage>
        <Switch>
          <Route exact path="/" component={DiscussionList} />
          <Route path="/discussions/:discussionId" component={MessageList} />
          <Route path="/contacts" component={ContactBook} />
          <Route path="/settings/">
            <Settings>
              <Route path="/settings/account" component={Account} />
              <Route path="/settings/tags" component={Tags} />
              <Route path="/settings/devices" component={Devices}>
                <Route path="/settings/devices/:deviceId" component={Device} />
              </Route>
            </Settings>
          </Route>
        </Switch>
      </I18nPage>
    </Route>
  </Switch>
);

export default Routes;
