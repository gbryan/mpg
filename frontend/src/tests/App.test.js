import React from 'react';
import {wait} from '@testing-library/dom';
import * as VehicleService from '../VehicleService';
import MatchingVehicles from './fixtures/MatchingVehicles';
import Makes from './fixtures/Makes';
import Models from './fixtures/Models';
import App from '../App';
import {fireEvent, render} from '@testing-library/react';

jest.mock('../VehicleService');

describe('App', () => {
  let getMatchingVehicles,
    getMakes,
    getModels;

  beforeEach(() => {
    getMatchingVehicles = VehicleService.getMatchingVehicles.mockResolvedValue(MatchingVehicles);
    getMakes = VehicleService.getMakes.mockResolvedValue(Makes);
    getModels = VehicleService.getModels.mockResolvedValue(Models);
    VehicleService.getYears.mockReturnValue([2020, 2019]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function selectFirstOption(element) {
    fireEvent.keyDown(element, {key: 'ArrowDown'});
    fireEvent.keyDown(element, {key: 'Enter'});
  }

  async function setAndAssertAllFilters(container) {
    const year = container.querySelector('#year');
    selectFirstOption(year);
    await wait(() => {
      expect(getMakes.mock.calls.length).toEqual(1);
      expect(getModels.mock.calls.length).toEqual(0);
      expect(getMatchingVehicles.mock.calls.length).toEqual(0);
    });

    const make = container.querySelector('#make');
    selectFirstOption(make);
    await wait(() => {
      expect(getModels.mock.calls.length).toEqual(1);
      expect(getMatchingVehicles.mock.calls.length).toEqual(0);
    });

    const model = container.querySelector('#model');
    selectFirstOption(model);
    await wait(() => {
      expect(getMatchingVehicles.mock.calls.length).toEqual(1);
    });
  }

  it('Makes expected calls to vehicle service when setting each filter', async () => {
    const {container} = render(<App/>);
    await setAndAssertAllFilters(container);
  });

  it('Renders matching vehicles when all filters are specified', async () => {
    const {container} = render(<App/>);
    await setAndAssertAllFilters(container);

    [
      container.querySelector('table.results tr[data-vehicle-id="40610"]'),
      container.querySelector('table.results tr[data-vehicle-id="40611"]'),
    ].forEach(e => expect(e).not.toEqual(null));

    // Chart should not be shown yet since no vehicle is selected.
    const chart = container.querySelector('.recharts-responsive-container');
    expect(chart).toEqual(null);
  });

  it('Renders chart and vehicle details when selecting a vehicle', async () => {
    const {container} = render(<App/>);
    await setAndAssertAllFilters(container);

    const firstVehicle = container.querySelector('table.results tr[data-vehicle-id="40610"]');
    fireEvent.click(firstVehicle);

    const chart = container.querySelector('.recharts-responsive-container');
    expect(chart).not.toEqual(null);

    const detailsRow = container.querySelector('.vehicleDetail[data-vehicle-id="40610"]');
    expect(detailsRow).not.toEqual(null);

    const deselectedRow = container.querySelector('.vehicleDetail[data-vehicle-id="40611"]');
    expect(deselectedRow).toEqual(null);
  });
});
