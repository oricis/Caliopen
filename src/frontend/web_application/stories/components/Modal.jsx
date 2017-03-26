import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, number, boolean } from '@kadira/storybook-addon-knobs';
import Modal from '../../src/components/Modal';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    isOpen: boolean('isOpen', true),
    onAfterOpen: action('onAfterOpen'),
    onRequestClose: action('onRequestClose'),
    closeTimeoutMS: number('closeTimeoutMS', 0),
    contentLabel: text('contentLabel', ''),
  };

  return (
    <div>
      <ComponentWrapper>
        <Modal title={text('title', 'modal.title')} {...props}>
          <p>{text('modal text', 'Quibus occurrere bene pertinax miles explicatis ordinibus parans hastisque feriens scuta qui habitus iram pugnantium concitat et dolorem proximos iam gestu terrebat sed eum in certamen alacriter consurgentem revocavere ductores rati intempestivum anceps subire certamen cum haut longe muri distarent, quorum tutela securitas poterat in solido locari cunctorum.')}</p>
        </Modal>
      </ComponentWrapper>
      <Code>
        {`
import Modal from './src/components/Modal';
export default () => (<Modal  title="modal.title"/>);
        `}
      </Code>
    </div>
  );
};


export default Presenter;
