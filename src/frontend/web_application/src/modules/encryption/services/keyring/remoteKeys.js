import { selectKeys } from '../../selectors/publicKey';

const includes = (array, value) => array.some(v => v === value);
const intersect = (arr1, arr2) => arr1.some(value => includes(arr2, value));


// XXX: refactor as a redux selector: const keysSelector = (state, { contactIds }) => {};
export const getStoredKeys = (state, contactIds) => {
  const missingKeysContactIds = [];
  const cachedKeys = contactIds.reduce((acc, contactId) => {
    const keys = selectKeys(state, contactId);

    if (!(keys && keys.length > 0)) {
      missingKeysContactIds.push(contactId);

      return acc;
    }

    return [...acc, ...keys];
  }, []);

  return { keys: cachedKeys, missingKeysContactIds };
};

export const filterKeysByAddress = (keys, addresses) => keys
  .filter(({ emails }) => intersect(emails, addresses));

export const checkEachAddressHasKey = (addresses, keys) => addresses
  .every(address => keys.some(({ emails }) => includes(emails, address)));
