import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Badge from './components/Badge';
import Brand from './components/Brand';
import BlockList from './components/BlockList';
import Button from './components/Button';
import Subtitle from './components/Subtitle';
import ContactAvatarLetter from './components/ContactAvatarLetter';
import ContactDetails from './components/ContactDetails';
import Icon from './components/Icon';
import Link from './components/Link';
import AuthPage from './layouts/AuthPage';
import SignupForm from './layouts/SignupForm';
import Fieldset from './components/Fieldset';
import FormGrid from './components/FormGrid';
import RadioFieldGroup from './components/RadioFieldGroup';
import SelectFieldGroup from './components/SelectFieldGroup';
import SwitchFieldGroup from './components/SwitchFieldGroup';
import PasswordStrength from './components/PasswordStrength';
import Spinner from './components/Spinner';
import TextFieldGroup from './components/TextFieldGroup';
import TextList from './components/TextList';
import Title from './components/Title';
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
.add('Brand', () => (
  <Brand />
))
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
  .add('Title', () => (
    <Title />
  ))
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
  .add('TextFieldGroup', () => (
    <TextFieldGroup />
  ))
  .add('PasswordStrength', () => (
    <PasswordStrength />
  ))
  .add('SelectFieldGroup', () => (
    <SelectFieldGroup />
  ))
  .add('RadioFieldGroup', () => (
    <RadioFieldGroup />
  ))
  .add('SwitchFieldGroup', () => (
    <SwitchFieldGroup />
  ));

storiesOf('Contact', module)
  .add('ContactDetails', () => (
    <ContactDetails />
  ));

storiesOf('Auth', module)
  .add('SignupForm', () => (
    <SignupForm />
  ))
  .add('AuthPage', () => (
    <AuthPage />
  ));
