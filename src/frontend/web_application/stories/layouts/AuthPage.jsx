import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import LoginForm from '../../src/components/LoginForm/presenter';
import AuthPage from '../../src/layouts/AuthPage';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    const noop = str =>str;

    return (
      <div>
        <ComponentWrapper>
          <AuthPage version="0.1" login="foo" password="bar">
            <LoginForm __={noop} />
          </AuthPage>
        </ComponentWrapper>
        <Code>
          {`
import LoginForm from './src/components/LoginForm';
export default () => (
  <AuthPage version="0.1" login="foo" password="bar">
    <LoginForm />
  </AuthPage>
);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
