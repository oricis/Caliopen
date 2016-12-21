import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Badge from './components/Badge';
import BlockList from './components/BlockList';
import Button from './components/Button';
import ContactAvatarLetter from './components/ContactAvatarLetter';
import Link from './components/Link';
import Welcome from './Welcome';
import '../src/styles/vendor/bootstrap_foundation-sites.scss';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome />
  ));

storiesOf('Badge', module)
  .add('Badge', () => (
    <Badge />
  ));

storiesOf('BlockList', module)
  .add('BlockList & ItemContent', () => (
    <BlockList />
  ));

storiesOf('Buttons & Links', module)
  .add('Buttons', () => (
    <Button />
  ))
  .add('Links', () => (
    <Link />
  ));

storiesOf('Icons & Avatars', module)
  .add('ContactAvatarLetter', () => (
    <ContactAvatarLetter />
  ));
