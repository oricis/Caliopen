export const isValidRecipient = ({ recipient, identity }) =>
  !identity || recipient.protocol === identity.protocol;
