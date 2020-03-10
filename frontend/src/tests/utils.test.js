import {parseNumeric} from '../utils';

describe('parseNumeric', () => {
  it('returns empty string if only non-numeric characters are provided', () => {
    const result = parseNumeric('asdf#$%');
    expect(result).toEqual('');
  });
  it('returns empty string if any non-numeric characters are provided', () => {
    const result = parseNumeric('234df#$%');
    expect(result).toEqual('234');
  });
  it('returns the whole string if the input string is entirely numeric', () => {
    const result = parseNumeric('2.35');
    expect(result).toEqual('2.35');
  });
});
