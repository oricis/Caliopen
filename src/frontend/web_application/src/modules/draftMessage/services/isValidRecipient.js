export const isValidRecipient = ({ recipient, identity }) =>
  recipient.protocol === identity.protocol;
