import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VehicleChart from './VehicleChart';
import styles from './VehicleChartWrapper.module.css';
import {CHART_VIEW, FUEL_TYPES} from './constants';

class VehicleChartWrapper extends Component {
  constructor(props) {
    super(props);

    this.toggleShowCo2 = this.toggleShowCo2.bind(this);
    this.getChartSeries = this.getChartSeries.bind(this);
  }

  getPerMileGramsCo2e(kwh100Miles) {
    const gramsPerLb = 453.592;
    const mwhPerKwh = 1 / 1000;
    const gramsCo2ePerKwh = this.props.co2eLbsMwh * gramsPerLb * mwhPerKwh;
    return gramsCo2ePerKwh * (kwh100Miles / 100);
  }

  getKgCo2PerYear(vehicle) {
    const fuel1Miles = this.getFuel1YearlyMiles(vehicle.id);
    const fuel2Miles = this.getFuel2YearlyMiles(vehicle.id);
    const electricRatio = (vehicle.combUtilityFactor || 0);

    // For PHEV, the CO2 emissions (e.g. co2GpmFuel1) from the original data set are the
    // total CO2 GPM for this fuel type * the percentage of
    // assumed hydrocarbon-based fuel usage. For example, if the vehicle emits 200g CO2 per mile when
    // running on gasoline (fuel type 1) and has a utility factor of 0.5, the value of vehicle.co2GpmFuel1
    // will be 100.
    const fuel1Co2GpmCombined = parseFloat(vehicle.co2GpmFuel1) || 0;
    const fuel2Co2GpmCombined = parseFloat(vehicle.co2GpmFuel2) || 0;

    let fuel1Co2Gpm;
    let fuel2Co2Gpm;

    if (vehicle.fuelType1 === FUEL_TYPES.ELECTRICITY) {
      fuel1Co2Gpm = this.getPerMileGramsCo2e(vehicle.kwh100Miles);
    } else {
      fuel1Co2Gpm = electricRatio > 0 ? fuel1Co2GpmCombined / (1 - electricRatio) : fuel1Co2GpmCombined;
    }

    if (vehicle.fuelType2 === FUEL_TYPES.ELECTRICITY) {
      fuel2Co2Gpm = this.getPerMileGramsCo2e(vehicle.kwh100Miles);
    } else {
      fuel2Co2Gpm = electricRatio > 0 ? fuel2Co2GpmCombined / (1 - electricRatio) : fuel2Co2GpmCombined;
    }

    return ((fuel1Co2Gpm * fuel1Miles) + (fuel2Co2Gpm * fuel2Miles)) / 1000;
  }

  getElectricCostPerMile(vehicle) {
    return this.props.fuelCostsDollars.Electricity * (vehicle.kwh100Miles / 100);
  }

  getHydrocarbonCostPerMile(fuelType, mpg) {
    return this.props.fuelCostsDollars[fuelType] / mpg;
  }

  getFuel2MilesPct(vehicleId) {
    return ((this.props.fuel2MilesPct[vehicleId] || 0) / 100);
  }

  getFuel1YearlyMiles(vehicleId) {
    return (1 - this.getFuel2MilesPct(vehicleId)) * this.props.milesPerYear;
  }

  getFuel2YearlyMiles(vehicleId) {
    return this.getFuel2MilesPct(vehicleId) * this.props.milesPerYear;
  }

  getCostPerYear(vehicle) {
    let fuel2Cost = 0;

    if (vehicle.fuelType2) {
      const fuel2Miles = this.getFuel2YearlyMiles(vehicle.id);
      let dollarsPerMile;

      if (vehicle.fuelType2 === FUEL_TYPES.ELECTRICITY) {
        dollarsPerMile = this.getElectricCostPerMile(vehicle);
      } else {
        dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType2, vehicle.combMpgFuel2);
      }

      fuel2Cost = dollarsPerMile * fuel2Miles;
    }

    const fuel1Miles = this.getFuel1YearlyMiles(vehicle.id);
    let dollarsPerMile;

    if (vehicle.fuelType1 === FUEL_TYPES.ELECTRICITY) {
      dollarsPerMile = this.getElectricCostPerMile(vehicle);
    } else {
      dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType1, vehicle.combMpgFuel1);
    }

    const fuel1Cost = dollarsPerMile * fuel1Miles;

    return fuel1Cost + fuel2Cost;
  }

  getDollarPerYearData(vehicle) {
    const data = [];
    let dollarsPerYear = this.getCostPerYear(vehicle);
    const currYear = new Date().getFullYear();
    let prevYearCost = this.props.vehiclePrices[vehicle.id] || 0;
    data.push({category: currYear, value: prevYearCost})

    for (let year = currYear + 1; year <= currYear + 20; year++) {
      let cumulativeCost = prevYearCost + dollarsPerYear;
      data.push({category: year, value: cumulativeCost});
      prevYearCost = cumulativeCost;
    }

    return data;
  }

  getCo2PerYearData(vehicle) {
    const data = [];
    const co2PerYear = Math.round(this.getKgCo2PerYear(vehicle));
    const currYear = new Date().getFullYear();
    let prevYearCo2 = 0;
    data.push({category: currYear, value: prevYearCo2});

    for (let year = currYear + 1; year <= currYear + 20; year++) {
      const cumulativeCo2 = co2PerYear + prevYearCo2;
      data.push({category: year, value: cumulativeCo2});
      prevYearCo2 = cumulativeCo2;
    }

    return data;
  }

  getChartSeries() {
    if (!this.props.selectedVehicles.length) {
      return [];
    }

    let dataFn;

    if (this.props.chartView === CHART_VIEW.FUEL_COST) {
      dataFn = this.getDollarPerYearData;
    } else {
      dataFn = this.getCo2PerYearData;
    }

    dataFn = dataFn.bind(this);

    return this.props.selectedVehicles.map(vehicle => {
      const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const data = dataFn(vehicle);
      return {name, data};
    });
  }

  toggleShowCo2(e) {
    const chartView = e.currentTarget.getAttribute('data-id');
    this.props.onToggleChartView(chartView);
  }

  render() {
    const chartSeries = this.getChartSeries();

    if (!chartSeries.length) {
      return null;
    }

    return (
      <div>
        <div>
          <ul className={styles.co2Toggle}>
            <li
              className={this.props.chartView === CHART_VIEW.FUEL_COST ? styles.selected : ''}
              data-id={CHART_VIEW.FUEL_COST}
              onClick={this.toggleShowCo2}
            >
              By Fuel Cost
            </li>
            <li
              className={this.props.chartView === CHART_VIEW.EMISSIONS ? styles.selected : ''}
              data-id={CHART_VIEW.EMISSIONS}
              onClick={this.toggleShowCo2}
            >
              By Co<sub>2</sub> Emissions
            </li>
          </ul>
        </div>
        <h2 className={styles.chartTitle}>
          {
            this.props.chartView === CHART_VIEW.FUEL_COST ?
              'Cumulative Fuel Cost'
              : <span>Cumulative Kilograms of CO<sub>2</sub> Emitted</span>
          }
        </h2>
        <VehicleChart
          series={chartSeries}
          unit={this.props.chartView === CHART_VIEW.FUEL_COST ? 'currency': 'kg CO₂'}
        />
      </div>
    );
  }
}

VehicleChartWrapper.propTypes = {
  onToggleChartView: PropTypes.func.isRequired,
  chartView: PropTypes.string.isRequired,
  fuelCostsDollars: PropTypes.object.isRequired,
  fuel2MilesPct: PropTypes.object.isRequired,
  milesPerYear: PropTypes.number.isRequired,
  selectedVehicles: PropTypes.array.isRequired,
  vehiclePrices: PropTypes.object.isRequired,
  co2eLbsMwh: PropTypes.number.isRequired,
};

export default VehicleChartWrapper;
