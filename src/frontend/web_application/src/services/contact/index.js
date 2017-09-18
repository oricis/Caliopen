export function formatName({ contact, format }) {
  const title = format.split(',')
    .map(field => field.trim())
    .map(field => contact[field])
    .join(' ')
    .trim()
  ;

  return title || contact.title;
}

export function getFirstLetter(string, defaultLetter = '?') {
  let firstLetter = defaultLetter;
  if (string) {
    firstLetter = string.substr(0, 1).toLowerCase();
  }

  if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZeéèEÉÈàÀâÂâÄîÎïÏçÇùûôÔöÖ'.indexOf(firstLetter) === -1) {
    firstLetter = defaultLetter;
  }

  return firstLetter;
}
