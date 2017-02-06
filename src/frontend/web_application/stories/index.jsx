import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Badge from './components/Badge';
import Brand from './components/Brand';
import PiBar from './components/PiBar';
import BlockList from './components/BlockList';
import Button from './components/Button';
import DefList from './components/DefList';
import Dropdown from './components/Dropdown';
import ContactAvatarLetter from './components/ContactAvatarLetter';
import ContactDetails from './components/ContactDetails';
import Icon from './components/Icon';
import Link from './components/Link';
import SigninPage from './layouts/SigninPage';
import SignupPage from './layouts/SignupPage';
import Fieldset from './components/Fieldset';
import FormGrid from './components/FormGrid';
import Section from './components/Section';
import RadioFieldGroup from './components/RadioFieldGroup';
import SelectFieldGroup from './components/SelectFieldGroup';
import Subtitle from './components/Subtitle';
import CheckboxFieldGroup from './components/CheckboxFieldGroup';
import PasswordStrength from './components/PasswordStrength';
import Spinner from './components/Spinner';
import TextFieldGroup from './components/TextFieldGroup';
import TextList from './components/TextList';
import Title from './components/Title';
import Devices from './layouts/Devices';
import Welcome from './Welcome';
import Changelog from './Changelog';
import '../src/styles/vendor/bootstrap_foundation-sites.scss';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome />
  ))
  .add('Changelog', () => (
    <Changelog />
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
  ))
  .add('DefList', () => (
    <DefList />
  ));

storiesOf('Buttons & Links', module)
  .add('Buttons', () => (
    <Button />
  ))
  .add('Links', () => (
    <Link />
  ));
storiesOf('Dropdown', module)
  .add('Dropdown', () => (
    <Dropdown />
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

storiesOf('Pi', module)
  .add('PiBar', () => (
    <PiBar />
  ));

storiesOf('Layout', module)
  .add('Section', () => (
    <Section />
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
  .add('CheckboxFieldGroup', () => (
    <CheckboxFieldGroup />
  ));

storiesOf('Contact', module)
  .add('ContactDetails', () => (
    <ContactDetails />
  ));

storiesOf('Auth', module)
  .add('SignupPage', () => (
    <SignupPage />
  ))
  .add('SigninPage', () => (
    <SigninPage />
  ));

storiesOf('Settings', module)
    .add('Devices', () => (
      <Devices />
    ));
