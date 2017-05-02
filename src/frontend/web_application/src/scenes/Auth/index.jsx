import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from '../../layouts/AuthPage';
import enableI18n from '../../services/i18n';
import Signin from '../Signin';
import Signup from '../Signup';

const I18nAuthPage = enableI18n(AuthPage);

const Auth = () => (
  <I18nAuthPage>
    <Switch>
      <Route exact path="/auth/"><Redirect to="signin" /></Route>
      <Route path="/auth/signin" component={Signin} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/signout"><Redirect to="signin" /></Route>
    </Switch>
  </I18nAuthPage>
);

export default Auth;
