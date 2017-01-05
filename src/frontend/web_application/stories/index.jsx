import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Badge from './components/Badge';
import BlockList from './components/BlockList';
import Button from './components/Button';
import Subtitle from './components/Subtitle';
import ContactAvatarLetter from './components/ContactAvatarLetter';
import Icon from './components/Icon';
import Link from './components/Link';
import Fieldset from './components/Fieldset';
import FormGrid from './components/FormGrid';
import RadioFieldGroup from './components/RadioFieldGroup';
import Spinner from './components/Spinner';
import TextList from './components/TextList';
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

storiesOf('Lists', module)
  .add('BlockList & ItemContent', () => (
    <BlockList />
  ))
  .add('TextList & ItemContent', () => (
    <TextList />
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

storiesOf('Form', module)
  .add('Fieldset', () => (
    <Fieldset />
  ))
  .add('FormGrid', () => (
    <FormGrid />
  ))
  .add('RadioFieldGroup', () => (
    <RadioFieldGroup />
  ));
