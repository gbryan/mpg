import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import ZipCodeInput from '../ZipCodeInput';

describe('ZipCodeInput', () => {
  it('allows digits to be entered', () => {
    const onChange = jest.fn();
    const {container} = render(
      <ZipCodeInput value="" onChange={onChange}/>
    );

    const input = container.querySelector('input');
    expect(input).not.toEqual(null);

    // Enter a digit.
    fireEvent.change(input, {target: {value: '9'}});
    expect(onChange).lastCalledWith('9');

    // Enter more digits.
    fireEvent.change(input, {target: {value: '94103'}});
    expect(onChange).lastCalledWith('94103');
  });

  it('does not allow entering non-digits', () => {
    const onChange = jest.fn();
    const {container} = render(
      <ZipCodeInput value="" onChange={onChange}/>
    );

    const input = container.querySelector('input');
    expect(input).not.toEqual(null);

    // Enter a non-digit.
    fireEvent.change(input, {target: {value: 'a'}});
    expect(onChange).lastCalledWith('');
  });
});
