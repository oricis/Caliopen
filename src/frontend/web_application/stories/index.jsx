import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Badge from './components/Badge';
import BlockList from './components/BlockList';
import Button from './components/Button';
import Subtitle from './components/Subtitle';
import ContactAvatarLetter from './components/ContactAvatarLetter';
import Icon from './components/Icon';
import Link from './components/Link';
import Spinner from './components/Spinner';
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
  ))
  .add('Icon', () => (
    <Icon />
  ))
  .add('Spinner', () => (
    <Spinner />
  ));

storiesOf('Titles', module)
  .add('Subtitle', () => (
    <Subtitle />
  ));
