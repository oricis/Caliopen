import { PROTOCOL_EMAIL, PROTOCOL_TWITTER } from '../../remoteIdentity';

export const addAddressToContact = (contact, { address, protocol }) => {
  switch (protocol) {
    case PROTOCOL_EMAIL:
      return {
        ...contact,
        emails: [
          ...(contact.emails ? contact.emails : []),
          { address },
        ],
      };
    case PROTOCOL_TWITTER:
      return {
        ...contact,
        identities: [
          ...(contact.identities ? contact.identities : []),
          { type: protocol, name: address },
        ],
      };
    default:
      throw new Error(`unknown protocol "${protocol}"`);
  }
};
