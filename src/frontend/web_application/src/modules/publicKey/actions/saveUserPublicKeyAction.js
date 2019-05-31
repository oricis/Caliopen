import { addAddressesToContact, updateContact } from '../../contact';
import { PROTOCOL_EMAIL } from '../../remoteIdentity';

export const saveUserPublicKeyAction =
  (publicKeyArmored, { contact }) => async (dispatch, getState) => {
    const openpgp = await import(/* webpackChunkName: "openpgp" */ 'openpgp');
    const publicKey = await openpgp.key.readArmored(publicKeyArmored);
    const keyEmails = publicKey.getUserIds().map(userId => userId.email);
    const contactEmails = contact.emails.map(email => email.address);

    const missingEmails = keyEmails.filter(email => !contactEmails.include(email))
      .map(email => ({ address: email, protocol: PROTOCOL_EMAIL }));
    const contactWithNewEmails = addAddressesToContact(contact, missingEmails);
    if (contactWithNewEmails !== contact) {
      // Await needed in case no email coincides in pubKey/contact.
      await updateContact({ contactWithNewEmails, contact })(dispatch, getState);
    }
  };
