import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { select, object } from '@kadira/storybook-addon-knobs';
import ContactAvatarLetter, { SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE } from '../../src/components/ContactAvatarLetter';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const sizes = [SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE].reduce((acc, size) => ({ ...acc, [size]: size }), { '': '' });
  const props = {
    contact: object('contact', { title: 'Foobar' }),
    size: select('size', sizes, ''),
  };

  return (
    <div>
      <ComponentWrapper size="tall">
        <ContactAvatarLetter {...props} />
      </ComponentWrapper>
      <Code>
        {`
import ContactAvatarLetter, { SIZE_SMALL } from './src/components/ContactAvatarLetter';
export default () => (<ContactAvatarLetter size={SIZE_SMALL} contact={contact} />);
        `}
      </Code>
    </div>
  );
};


export default Presenter;
