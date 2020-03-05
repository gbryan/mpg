import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import GridEmissions from '../GridEmissions';
import emissionsResp from './fixtures/Emissions';
import emissionsNotFoundResp from './fixtures/EmissionsNotFound';
import * as VehicleService from '../VehicleService';
import {waitForElement} from '@testing-library/dom';

jest.mock('../VehicleService');
const defaultCo2eLbsMwh = 1000;

describe('GridEmissions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not call onChange when < 5 digits entered', async () => {
    const onChange = jest.fn();
    const {container} = render(
      <GridEmissions defaultCo2eLbsMwh={defaultCo2eLbsMwh} onChange={onChange}/>
    );

    const input = container.querySelector('input');
    expect(input).not.toEqual(null);

    fireEvent.change(input, {target: {value: '9'}});

    // Should show "X" icon.
    await waitForElement(() => container.querySelector('i.statusIcon.fa-times'));

    expect(onChange.mock.calls.length).toEqual(0);
  });

  it('calls onChange when === 5 digits entered', async () => {
    VehicleService.getGridEmissions.mockResolvedValue(emissionsResp.avgCo2eLbsMwh);

    const onChange = jest.fn();
    const expectedValFromServer = 529;
    const {container} = render(
      <GridEmissions defaultCo2eLbsMwh={defaultCo2eLbsMwh} onChange={onChange}/>
    );

    const input = container.querySelector('input');
    expect(input).not.toEqual(null);

    fireEvent.change(input, {target: {value: '07676'}});

    // Should show checkmark icon.
    await waitForElement(() => container.querySelector('i.statusIcon.fa-check'));

    expect(onChange).lastCalledWith(expectedValFromServer);
  });

  it('sets emissions value to default when zip code not found on server', async () => {
    VehicleService.getGridEmissions.mockResolvedValue(emissionsNotFoundResp.avgCo2eLbsMwh);

    const onChange = jest.fn();
    const {container} = render(
      <GridEmissions defaultCo2eLbsMwh={defaultCo2eLbsMwh} onChange={onChange}/>
    );

    const input = container.querySelector('input');
    expect(input).not.toEqual(null);

    fireEvent.change(input, {target: {value: '00000'}});

    // Should show "X" icon.
    await waitForElement(() => container.querySelector('i.statusIcon.fa-times'));

    // Expect to be updated with default value since the server didn't find this zip code.
    expect(onChange).lastCalledWith(defaultCo2eLbsMwh);
  });
});
