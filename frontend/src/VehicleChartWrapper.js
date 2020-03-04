import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VehicleChart from './VehicleChart';
import styles from './VehicleChartWrapper.module.css';

class VehicleChartWrapper extends Component {
  constructor(props) {
    super(props);

    this.toggleShowCo2 = this.toggleShowCo2.bind(this);
    this.getChartSeries = this.getChartSeries.bind(this);
  }

  getKgCo2PerYear(vehicle) {
    const fuel1Miles = this.getFuel1YearlyMiles(vehicle.id);
    const fuel2Miles = this.getFuel2YearlyMiles(vehicle.id);
    const fuel1Co2Gpm = parseFloat(vehicle.co2GpmFuel1) || 0;
    const fuel2Co2Gpm = parseFloat(vehicle.co2GpmFuel2) || 0;
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

      if (vehicle.fuelType2 === 'Electricity') {
        dollarsPerMile = this.getElectricCostPerMile(vehicle);
      } else {
        dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType2, vehicle.combMpgFuel2);
      }

      fuel2Cost = dollarsPerMile * fuel2Miles;
    }

    const fuel1Miles = this.getFuel1YearlyMiles(vehicle.id);
    let dollarsPerMile;

    if (vehicle.fuelType1 === 'Electricity') {
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

    for (let year = currYear; year <= currYear + 20; year++) {
      let cumulativeCost = prevYearCost + dollarsPerYear;
      data.push({category: year, value: cumulativeCost});
      prevYearCost = cumulativeCost;
    }

    return data;
  }

  getCo2PerYearData(vehicle) {
    const data = [];
    const co2PerYear = this.getKgCo2PerYear(vehicle);
    const currYear = new Date().getFullYear();
    let prevYearCo2 = 0;

    for (let year = currYear; year <= currYear + 20; year++) {
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

    if (this.props.isShowingFuelCost) {
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
    const showFuelCost = e.currentTarget.getAttribute('data-id') === 'fuelCost';
    this.props.onToggleShowFuelCost(showFuelCost);
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
              className={this.props.isShowingFuelCost ? styles.selected : ''}
              data-id="fuelCost"
              onClick={this.toggleShowCo2}
            >
              By Fuel Cost
            </li>
            <li
              className={!this.props.isShowingFuelCost ? styles.selected : ''}
              data-id="emissions"
              onClick={this.toggleShowCo2}
            >
              By Co<sub>2</sub> Emissions
            </li>
          </ul>
        </div>
        <h2 className={styles.chartTitle}>
          {
            this.props.isShowingFuelCost ?
              'Cumulative Fuel Cost'
              : <span>Cumulative Kilograms of CO<sub>2</sub> Emitted</span>
          }
        </h2>
        <VehicleChart
          series={chartSeries}
          unit={this.props.isShowingFuelCost ? 'currency': 'kg CO₂'}
        />
      </div>
    );
  }
}

VehicleChartWrapper.propTypes = {
  onToggleShowFuelCost: PropTypes.func.isRequired,
  isShowingFuelCost: PropTypes.bool.isRequired,
  fuelCostsDollars: PropTypes.object.isRequired,
  fuel2MilesPct: PropTypes.object.isRequired,
  milesPerYear: PropTypes.number.isRequired,
  selectedVehicles: PropTypes.array.isRequired,
  vehiclePrices: PropTypes.object.isRequired,
};

export default VehicleChartWrapper;
