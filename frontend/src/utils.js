/**
 * Returns the numeric portion of a string, including any decimals.
 * @return {string}
 */
export function parseNumeric(numericString) {
  const digitsAndDecimal = /[0-9.]*/;
  const matches = numericString.match(digitsAndDecimal);

  return matches[0];
}
