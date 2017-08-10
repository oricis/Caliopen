import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import AuthPage from '../../layouts/AuthPage';
import Signin from '../Signin';
import BaseSpinner from '../../components/Spinner';

const Spinner = () => (<BaseSpinner isLoading />);

const AsyncSignup = Loadable({
  loader: () => import('../Signup'),
  loading: Spinner,
});

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
