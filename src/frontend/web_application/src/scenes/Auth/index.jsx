import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from '../../layouts/AuthPage';
import Signin from '../Signin';
import AsyncLoad from '../../components/AsyncLoad';
import Spinner from '../../components/Spinner';

const AsyncSignup = () => (
  <AsyncLoad load={import('../Signup')} loading={(<Spinner isLoading />)} />
);

const Auth = () => (
  <AuthPage>
    <Switch>
      <Route exact path="/auth/"><Redirect to="signin" /></Route>
      <Route path="/auth/signin" component={Signin} />
      <Route path="/auth/signup" component={AsyncSignup} />
      <Route path="/auth/signout"><Redirect to="signin" /></Route>
    </Switch>
  </AuthPage>
);

export default Auth;
