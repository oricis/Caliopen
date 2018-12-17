export default function getClassName(word, defaultLetter = 'none') {
  let letter = defaultLetter;

  if (word) {
    letter = word.substr(0, 1).toLowerCase();
  }

  if ('abcdefghijklmnopqrstuvwxyz'.indexOf(letter) === -1) {
    letter = letter === '+' ? 'plus' : defaultLetter;
  }

  return `m-letter--${letter}`;
}
