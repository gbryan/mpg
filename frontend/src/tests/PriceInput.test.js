import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import PriceInput from '../PriceInput';

it('formats price as currency and sets expected attributes', () => {
  const onChange = jest.fn();
  const {container} = render(
    <PriceInput
      value={4.99}
      placeholder="Enter a price."
      fieldId={5}
      onChange={onChange}
    />
  );

  expect(container.innerHTML).toContain('value="$4.99"');
  expect(container.innerHTML).toContain('data-id="5"');
  expect(container.innerHTML).toContain('placeholder="Enter a price."');
});

it('calls onChange when value is updated', () => {
  const onChange = jest.fn();
  const id = '5';
  const {container} = render(
    <PriceInput
      value={4.99}
      placeholder="Enter a price."
      fieldId={id}
      onChange={onChange}
    />
  );

  const input = container.querySelector('input');
  input.focus();
  fireEvent.change(input, { target: { value: 2.99 } });

  expect(onChange).lastCalledWith(id, 2.99);
});
