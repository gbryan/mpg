import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import VehicleDetails from '../VehicleDetails';
import vehicles from './fixtures/MatchingVehicles';

describe('VehicleDetails', () => {
  it('shows a row for each selected vehicle', () => {
    const onDeselect = jest.fn();
    const onUpdatePrice = jest.fn();
    const onUpdateFuel2MilesPct = jest.fn();
    const {container} = render(
      <VehicleDetails
        selectedVehicles={vehicles}
        onDeselectVehicle={onDeselect}
        onUpdatePrice={onUpdatePrice}
        vehiclePrices={{
          40610: 18000,
          40611: 19500,
        }}
        fuel2MilesPct={{}}
        onUpdateFuel2MilesPct={onUpdateFuel2MilesPct}
        showVehiclePrices={true}
      />
    );

    const vehicleDetails = container.querySelectorAll('.vehicleDetail');
    expect(vehicleDetails.length).toEqual(2);

    // The one for vehicle ID 40611 supports E85 as the secondary fuel type, so it should
    // have a slider for specifying fuel 2 miles percentage.
    const secondaryFuelVehicles = container.querySelectorAll('.vehicleDetail[data-vehicle-id="40611"]');
    expect(secondaryFuelVehicles.length).toEqual(1);

    const secondaryFuelVehicle = secondaryFuelVehicles[0];
    expect(secondaryFuelVehicle.textContent).toContain('Miles driven using E85');
    expect(secondaryFuelVehicle.querySelector('.rc-slider')).not.toEqual(null);

    // Since this vehicle has only 1 fuel type, it should not have the slider for secondary fuel.
    const singleFuelVehicle = container.querySelector('.vehicleDetail[data-vehicle-id="40610"]');
    expect(singleFuelVehicle.textContent).not.toContain('Miles driven using');
    expect(singleFuelVehicle.querySelector('.rc-slider')).toEqual(null);
  });

  it('calls onDeselectVehicle when clicking delete button', () => {
    const onDeselect = jest.fn();
    const onUpdatePrice = jest.fn();
    const onUpdateFuel2MilesPct = jest.fn();
    const {container} = render(
      <VehicleDetails
        selectedVehicles={vehicles}
        onDeselectVehicle={onDeselect}
        onUpdatePrice={onUpdatePrice}
        vehiclePrices={{
          40610: 18000,
          40611: 19500,
        }}
        fuel2MilesPct={{}}
        onUpdateFuel2MilesPct={onUpdateFuel2MilesPct}
        showVehiclePrices={true}
      />
    );

    const deleteButton = container.querySelector('button.delete[data-vehicle-id="40611"]');
    fireEvent.click(deleteButton);
    expect(onDeselect).lastCalledWith(40611);
  });

  it('calls onUpdatePrice when updating price', () => {
    const onDeselect = jest.fn();
    const onUpdatePrice = jest.fn();
    const onUpdateFuel2MilesPct = jest.fn();
    const {container} = render(
      <VehicleDetails
        selectedVehicles={vehicles}
        onDeselectVehicle={onDeselect}
        onUpdatePrice={onUpdatePrice}
        vehiclePrices={{
          40610: 18000,
          40611: 19500,
        }}
        fuel2MilesPct={{}}
        onUpdateFuel2MilesPct={onUpdateFuel2MilesPct}
        showVehiclePrices={true}
      />
    );

    const priceInput = container.querySelector('input[data-id="40611"]');
    priceInput.focus();
    fireEvent.change(priceInput, {target: {value: 19000}});
    expect(onUpdatePrice).lastCalledWith('40611', 19000);
  });

  it('should not show price input when showVehiclePrices is false', () => {
    const onDeselect = jest.fn();
    const onUpdatePrice = jest.fn();
    const onUpdateFuel2MilesPct = jest.fn();
    const {container} = render(
      <VehicleDetails
        selectedVehicles={vehicles}
        onDeselectVehicle={onDeselect}
        onUpdatePrice={onUpdatePrice}
        vehiclePrices={{
          40610: 18000,
          40611: 19500,
        }}
        fuel2MilesPct={{}}
        onUpdateFuel2MilesPct={onUpdateFuel2MilesPct}
        showVehiclePrices={false}
      />
    );

    [40610, 40611].forEach(id => {
      const priceInput = container.querySelector(`input[data-id="${id}"]`);
      expect(priceInput).toEqual(null);
    });
  });
});
