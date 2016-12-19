import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Button from './components/Button';
import Welcome from './Welcome';
import '../src/styles/vendor/foundation-sites.scss';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome />
  ));

storiesOf('Button', module)
  .add('Button', () => (
    <Button />
  ));
