import React from 'react';
import {render} from '@testing-library/react'
import ResultsList from '../ResultsList';
import vehicles from './fixtures/MatchingVehicles';

it('shows message when there are no results', () => {
  const onClick = jest.fn();
  const {container} = render(
    <ResultsList
      vehicles={[]}
      vehiclePrices={{}}
      selectedVehicles={[]}
      onClick={onClick}
    />
  );

  expect(container.textContent).toContain('Search for vehicles to get started.');
});

it('shows rows for selected vehicles with "selected" class', () => {
  const onClick = jest.fn();
  const {container} = render(
    <ResultsList
      vehicles={vehicles}
      vehiclePrices={{
        40610: 18000,
        40611: 19500,
      }}
      selectedVehicles={[vehicles[1]]}
      onClick={onClick}
    />
  );

  const vehicleRows = container.querySelectorAll('tbody tr');
  expect(vehicleRows.length).toEqual(2);

  const selectedVehicles = container.querySelectorAll('tbody tr.selected');
  expect(selectedVehicles.length).toEqual(1);

  const selectedVehicle = selectedVehicles[0];
  expect(selectedVehicle.getAttribute('data-vehicle-id')).toEqual('40611');

  expect(container.textContent).not.toContain('Search for vehicles to get started.');
});
