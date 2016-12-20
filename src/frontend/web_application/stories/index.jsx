import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Badge from './components/Badge';
import Button from './components/Button';
import Link from './components/Link';
import Welcome from './Welcome';
import '../src/styles/vendor/foundation-sites.scss';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome />
  ));

storiesOf('Badge', module)
  .add('Badge', () => (
    <Badge />
  ));

storiesOf('Buttons & Links', module)
  .add('Buttons', () => (
    <Button />
  ))
  .add('Links', () => (
    <Link />
  ));
