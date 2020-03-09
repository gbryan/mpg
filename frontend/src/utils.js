export function parseNumeric(numericString) {
  const digitsAndDecimal = /[0-9.]*/;
  const matches = numericString.match(digitsAndDecimal);

  if (!matches || !matches.length) {
    throw new Error('Invalid format for given numericString');
  }

  return matches[0];
}
