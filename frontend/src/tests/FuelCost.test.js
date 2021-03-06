import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import FuelCost from '../FuelCost';

describe('FuelCost', () => {
  it('shows correct units', () => {
    const visibleFuelTypes = ['Electricity', 'Diesel'];
    const prices = {
      'Diesel': 3.50,
      'Electricity': 0.12,
    };
    const onChange = jest.fn();
    const {container} = render(
      <FuelCost
        visibleFuelTypes={visibleFuelTypes}
        prices={prices}
        onChange={onChange}
      />
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toEqual(2);

    expect(container.textContent).toContain('Electricity (per kWh)');
    expect(container.textContent).toContain('Diesel (per gallon)');
  });

  it('shows formatted fuel cost for each fuel type', () => {
    const visibleFuelTypes = ['Diesel', 'Regular Gasoline'];
    const prices = {
      'Diesel': 3.50,
      'Regular Gasoline': 3.10,
    };
    const onChange = jest.fn();
    const {container} = render(
      <FuelCost
        visibleFuelTypes={visibleFuelTypes}
        prices={prices}
        onChange={onChange}
      />
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toEqual(2);

    const gasInput = container.querySelector('input[name="Regular Gasoline"]');
    expect(gasInput.value).toEqual('$3.10');

    const dieselInput = container.querySelector('input[name="Diesel"]');
    expect(dieselInput.value).toEqual('$3.50');
  });

  it('changes value when typing different fuel cost', () => {
    const visibleFuelTypes = ['Diesel', 'Regular Gasoline'];
    const prices = {
      'Diesel': 3.50,
      'Regular Gasoline': 3.10,
    };
    const onChange = jest.fn();
    const {container} = render(
      <FuelCost
        visibleFuelTypes={visibleFuelTypes}
        prices={prices}
        onChange={onChange}
      />
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toEqual(2);

    const gasInput = container.querySelector('input[name="Regular Gasoline"]');
    const newGasVal = '4.05';
    gasInput.focus();
    fireEvent.change(gasInput, {target: {value: newGasVal}});
    expect(onChange).lastCalledWith('Regular Gasoline', newGasVal);
  });
});
