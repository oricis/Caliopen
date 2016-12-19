import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Buttons from './Buttons';
import Welcome from './Welcome';
import '../src/styles/vendor/foundation-sites.scss';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome />
  ));

storiesOf('Button', module)
  .add('Button', () => (
    <Buttons />
  ));
