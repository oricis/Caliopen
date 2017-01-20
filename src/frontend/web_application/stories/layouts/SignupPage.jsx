import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import AuthPage from '../../src/layouts/AuthPage';
import SignupForm from '../../src/components/SignupForm';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper>
          <AuthPage version="0.1">
            <SignupForm />
          </AuthPage>
        </ComponentWrapper>
        <Code>
          {`
import SignupForm from './src/components/SignupForm';
export default () => (
    <SignupForm />
);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
