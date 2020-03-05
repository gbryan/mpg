import React from 'react';
import {render} from '@testing-library/react'
import VehicleChartWrapper from '../VehicleChartWrapper';
import vehicles from './fixtures/MatchingVehicles';
import electricVehicle from './fixtures/ElectricCar';
import TestRenderer from 'react-test-renderer';
import VehicleChart from '../VehicleChart';

it('shows expected title when currently showing fuel costs', () => {
  const onToggle = jest.fn();
  const {container} = render(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={true}
      fuelCostsDollars={{
        'Regular Gasoline': 3.1,
        'E85': 3.0,
      }}
      fuel2MilesPct={{40611: 50}}
      milesPerYear={12000}
      selectedVehicles={vehicles}
      vehiclePrices={{40611: 19500}}
    />
  );

  const title = container.querySelector('.chartTitle');
  expect(title.textContent).toEqual('Cumulative Fuel Cost');
});

it('shows expected title when currently showing emissions data', () => {
  const onToggle = jest.fn();
  const {container} = render(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={false}
      fuelCostsDollars={{
        'Regular Gasoline': 3.1,
        'E85': 3.0,
      }}
      fuel2MilesPct={{40611: 50}}
      milesPerYear={12000}
      selectedVehicles={vehicles}
      vehiclePrices={{40611: 19500}}
    />
  );

  const title = container.querySelector('.chartTitle');
  expect(title.textContent).toEqual('Cumulative Kilograms of CO2 Emitted');
});

it('hides chart when no vehicles are selected', () => {
  const onToggle = jest.fn();
  const {container} = render(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={false}
      fuelCostsDollars={{}}
      fuel2MilesPct={{}}
      milesPerYear={12000}
      selectedVehicles={[]}
      vehiclePrices={{}}
    />
  );

  expect(container.innerHTML).toEqual('');
});

it('generates correct chart series data for fuel costs with gas and E85', () => {
  const onToggle = jest.fn();
  const testRenderer = TestRenderer.create(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={true}
      fuelCostsDollars={{
        'Regular Gasoline': 3.1,
        'E85': 3.0,
      }}
      fuel2MilesPct={{40611: 50}}
      milesPerYear={12000}
      selectedVehicles={vehicles}
      vehiclePrices={{40610: 19000, 40611: 19500}}
    />
  );
  const testInstance = testRenderer.root;
  const chart = testInstance.findByType(VehicleChart);

  const expectedSeries = [
    {
      data: [
        {
          category: 2020,
          value: 19000,
        },
        {
          category: 2021,
          value: 20617.391304347824,
        },
        {
          category: 2022,
          value: 22234.78260869565,
        },
        {
          category: 2023,
          value: 23852.173913043473,
        },
        {
          category: 2024,
          value: 25469.565217391297,
        },
        {
          category: 2025,
          value: 27086.95652173912,
        },
        {
          category: 2026,
          value: 28704.347826086945,
        },
        {
          category: 2027,
          value: 30321.73913043477,
        },
        {
          category: 2028,
          value: 31939.130434782594,
        },
        {
          category: 2029,
          value: 33556.52173913042,
        },
        {
          category: 2030,
          value: 35173.91304347824,
        },
        {
          category: 2031,
          value: 36791.304347826066,
        },
        {
          category: 2032,
          value: 38408.69565217389,
        },
        {
          category: 2033,
          value: 40026.086956521714,
        },
        {
          category: 2034,
          value: 41643.47826086954,
        },
        {
          category: 2035,
          value: 43260.86956521736,
        },
        {
          category: 2036,
          value: 44878.26086956519,
        },
        {
          category: 2037,
          value: 46495.65217391301,
        },
        {
          category: 2038,
          value: 48113.043478260835,
        },
        {
          category: 2039,
          value: 49730.43478260866,
        },
        {
          category: 2040,
          value: 51347.826086956484,
        },
      ],
      name: '2019 Chrysler 300',
    },
    {
      data: [
        {
          category: 2020,
          value: 19500,
        },
        {
          category: 2021,
          value: 21367.519181585678,
        },
        {
          category: 2022,
          value: 23235.038363171356,
        },
        {
          category: 2023,
          value: 25102.557544757034,
        },
        {
          category: 2024,
          value: 26970.07672634271,
        },
        {
          category: 2025,
          value: 28837.59590792839,
        },
        {
          category: 2026,
          value: 30705.115089514067,
        },
        {
          category: 2027,
          value: 32572.634271099745,
        },
        {
          category: 2028,
          value: 34440.15345268542,
        },
        {
          category: 2029,
          value: 36307.672634271104,
        },
        {
          category: 2030,
          value: 38175.191815856786,
        },
        {
          category: 2031,
          value: 40042.71099744247,
        },
        {
          category: 2032,
          value: 41910.23017902815,
        },
        {
          category: 2033,
          value: 43777.74936061383,
        },
        {
          category: 2034,
          value: 45645.26854219951,
        },
        {
          category: 2035,
          value: 47512.78772378519,
        },
        {
          category: 2036,
          value: 49380.306905370875,
        },
        {
          category: 2037,
          value: 51247.82608695656,
        },
        {
          category: 2038,
          value: 53115.34526854224,
        },
        {
          category: 2039,
          value: 54982.86445012792,
        },
        {
          category: 2040,
          value: 56850.3836317136,
        },
      ],
      name: '2019 Chrysler 300 FlexFuel',
    },
  ];

  expect(chart.props.series).toStrictEqual(expectedSeries);
  expect(chart.props.unit).toBe('currency');
});

it('generates correct chart series data for fuel costs with electric vehicle', () => {
  const onToggle = jest.fn();
  const testRenderer = TestRenderer.create(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={true}
      fuelCostsDollars={{
        'Electricity': 0.1,
      }}
      fuel2MilesPct={{}}
      milesPerYear={12000}
      selectedVehicles={[electricVehicle]}
      vehiclePrices={{42274: 39500}}
    />
  );
  const testInstance = testRenderer.root;
  const chart = testInstance.findByType(VehicleChart);

  const expectedSeries = [
    {
      data: [
        {
          category: 2020,
          value: 39500,
        },
        {
          category: 2021,
          value: 39796.3076,
        },
        {
          category: 2022,
          value: 40092.6152,
        },
        {
          category: 2023,
          value: 40388.9228,
        },
        {
          category: 2024,
          value: 40685.2304,
        },
        {
          category: 2025,
          value: 40981.538,
        },
        {
          category: 2026,
          value: 41277.8456,
        },
        {
          category: 2027,
          value: 41574.1532,
        },
        {
          category: 2028,
          value: 41870.4608,
        },
        {
          category: 2029,
          value: 42166.7684,
        },
        {
          category: 2030,
          value: 42463.076,
        },
        {
          category: 2031,
          value: 42759.3836,
        },
        {
          category: 2032,
          value: 43055.6912,
        },
        {
          category: 2033,
          value: 43351.9988,
        },
        {
          category: 2034,
          value: 43648.3064,
        },
        {
          category: 2035,
          value: 43944.614,
        },
        {
          category: 2036,
          value: 44240.9216,
        },
        {
          category: 2037,
          value: 44537.2292,
        },
        {
          category: 2038,
          value: 44833.5368,
        },
        {
          category: 2039,
          value: 45129.8444,
        },
        {
          category: 2040,
          value: 45426.152,
        },
      ],
      name: '2020 Tesla Model 3 Long Range',
    },
  ];

  expect(chart.props.series).toStrictEqual(expectedSeries);
  expect(chart.props.unit).toBe('currency');
});

it('generates correct chart series data for emissions data - gas vehicle', () => {
  const onToggle = jest.fn();
  const testRenderer = TestRenderer.create(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={false}
      fuelCostsDollars={{}}
      fuel2MilesPct={{}}
      milesPerYear={12000}
      selectedVehicles={[vehicles[0]]}
      vehiclePrices={{}}
    />
  );
  const testInstance = testRenderer.root;
  const chart = testInstance.findByType(VehicleChart);

  const expectedSeries = [
    {
      data: [
        {
          category: 2020,
          value: 0,
        },
        {
          category: 2021,
          value: 4668,
        },
        {
          category: 2022,
          value: 9336,
        },
        {
          category: 2023,
          value: 14004,
        },
        {
          category: 2024,
          value: 18672,
        },
        {
          category: 2025,
          value: 23340,
        },
        {
          category: 2026,
          value: 28008,
        },
        {
          category: 2027,
          value: 32676,
        },
        {
          category: 2028,
          value: 37344,
        },
        {
          category: 2029,
          value: 42012,
        },
        {
          category: 2030,
          value: 46680,
        },
        {
          category: 2031,
          value: 51348,
        },
        {
          category: 2032,
          value: 56016,
        },
        {
          category: 2033,
          value: 60684,
        },
        {
          category: 2034,
          value: 65352,
        },
        {
          category: 2035,
          value: 70020,
        },
        {
          category: 2036,
          value: 74688,
        },
        {
          category: 2037,
          value: 79356,
        },
        {
          category: 2038,
          value: 84024,
        },
        {
          category: 2039,
          value: 88692,
        },
        {
          category: 2040,
          value: 93360,
        },
      ],
      name: '2019 Chrysler 300',
    },
  ];
  expect(chart.props.series).toStrictEqual(expectedSeries);
  expect(chart.props.unit).toBe('kg CO₂');
});

it('generates correct chart series data for emissions data - electric vehicle', () => {
  const onToggle = jest.fn();
  const testRenderer = TestRenderer.create(
    <VehicleChartWrapper
      co2eLbsMwh={1086.2}
      onToggleShowFuelCost={onToggle}
      isShowingFuelCost={false}
      fuelCostsDollars={{}}
      fuel2MilesPct={{}}
      milesPerYear={12000}
      selectedVehicles={[electricVehicle]}
      vehiclePrices={{}}
    />
  );
  const testInstance = testRenderer.root;
  const chart = testInstance.findByType(VehicleChart);

  const expectedSeries = [
    {
      data: [
        {
          category: 2020,
          value: 0,
        },
        {
          category: 2021,
          value: 1460,
        },
        {
          category: 2022,
          value: 2920,
        },
        {
          category: 2023,
          value: 4380,
        },
        {
          category: 2024,
          value: 5840,
        },
        {
          category: 2025,
          value: 7300,
        },
        {
          category: 2026,
          value: 8760,
        },
        {
          category: 2027,
          value: 10220,
        },
        {
          category: 2028,
          value: 11680,
        },
        {
          category: 2029,
          value: 13140,
        },
        {
          category: 2030,
          value: 14600,
        },
        {
          category: 2031,
          value: 16060,
        },
        {
          category: 2032,
          value: 17520,
        },
        {
          category: 2033,
          value: 18980,
        },
        {
          category: 2034,
          value: 20440,
        },
        {
          category: 2035,
          value: 21900,
        },
        {
          category: 2036,
          value: 23360,
        },
        {
          category: 2037,
          value: 24820,
        },
        {
          category: 2038,
          value: 26280,
        },
        {
          category: 2039,
          value: 27740,
        },
        {
          category: 2040,
          value: 29200,
        },
      ],
      name: '2020 Tesla Model 3 Long Range',
    },
  ];
  expect(chart.props.series).toStrictEqual(expectedSeries);
  expect(chart.props.unit).toBe('kg CO₂');
});
