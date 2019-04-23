import { getIdentityProtocol } from './getIdentityProtocol';

export const isValidRecipient = ({ recipient, identity }) => (
  !identity || recipient.protocol === getIdentityProtocol(identity)
);
