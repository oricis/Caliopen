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

export const addAddressesToContact = (contact, addresses) => {
  const emails = [
    ...(contact.emails ? contact.emails : []),
    ...addresses.filter(address => address.protocol === PROTOCOL_EMAIL)
      .map(address => ({ address: address.email, type: address.protocol })),
  ];

  const identities = [
    ...(contact.identities ? contact.identities : []),
    ...addresses.filter(address => address.protocol === PROTOCOL_TWITTER)
      .map(address => ({ address: address.identifier, type: address.protocol })),
  ];

  return {
    ...contact,
    emails,
    identities,
  };
};
