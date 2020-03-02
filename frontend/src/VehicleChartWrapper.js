import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VehicleChart from './VehicleChart';

class VehicleChartWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartSeries: [],
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedVehicles !== this.props.selectedVehicles ||
      prevProps.vehiclePrices !== this.props.vehiclePrices ||
      prevProps.fuelCostDollars !== this.props.fuelCostDollars ||
      prevProps.milesPerYear !== this.props.milesPerYear ||
      prevProps.fuel2MilesPct !== this.props.fuel2MilesPct
    ) {
      this.updateChart(this.props);
    }
  }

  getElectricCostPerMile(vehicle) {
    return this.props.fuelCostDollars.Electricity * (vehicle.kwh100Miles / 100);
  }

  getHydrocarbonCostPerMile(fuelType, mpg) {
    return this.props.fuelCostDollars[fuelType] / mpg;
  }

  getCostPerYear(vehicle) {
    let fuel2Cost = 0;

    if (vehicle.fuelType2) {
      const fuel2MilesPct = (this.props.fuel2MilesPct[vehicle.id] || 0) / 100;
      const fuel2Miles = fuel2MilesPct * this.props.milesPerYear;
      let dollarsPerMile;

      if (vehicle.fuelType2 === 'Electricity') {
        dollarsPerMile = this.getElectricCostPerMile(vehicle);
      } else {
        dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType2, vehicle.combMpgFuel2);
      }

      fuel2Cost = dollarsPerMile * fuel2Miles;
    }

    const fuel1MilesPct = 1 - ((this.props.fuel2MilesPct[vehicle.id] || 0) / 100);
    const fuel1Miles = fuel1MilesPct * this.props.milesPerYear;
    let dollarsPerMile;

    if (vehicle.fuelType1 === 'Electricity') {
      dollarsPerMile = this.getElectricCostPerMile(vehicle);
    } else {
      dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType1, vehicle.combMpgFuel1);
    }

    const fuel1Cost = dollarsPerMile * fuel1Miles;

    return fuel1Cost + fuel2Cost;
  }

  updateChart(props) {
    if (!props.selectedVehicles.length) {
      this.setState({chartSeries: []});
      return;
    }

    const chartSeries = props.selectedVehicles.map(vehicle => {
      const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const data = [];

      let dollarsPerYear = this.getCostPerYear(vehicle);
      const currYear = new Date().getFullYear();
      let prevYearCost = this.props.vehiclePrices[vehicle.id] || 0;

      for (let year = currYear; year <= currYear + 20; year++) {
        let thisYearCost = prevYearCost + dollarsPerYear;
        data.push({category: year, value: thisYearCost});
        prevYearCost = thisYearCost;
      }

      return {name, data};

    });

    this.setState({chartSeries});
  }

  render() {
    return <VehicleChart series={this.state.chartSeries}/>;
  }
}

VehicleChartWrapper.propTypes = {
  fuelCostDollars: PropTypes.object.isRequired,
  fuel2MilesPct: PropTypes.object.isRequired,
  milesPerYear: PropTypes.number.isRequired,
  selectedVehicles: PropTypes.array.isRequired,
  vehiclePrices: PropTypes.object.isRequired,
};

export default VehicleChartWrapper;
