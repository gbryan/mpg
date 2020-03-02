import React, {Component} from 'react';
import Filters from './Filters';
import ResultsList from './ResultsList';
import {getMakes, getMatchingVehicles, getModels, getYears} from './VehicleService';
import VehicleChart from './VehicleChart';
import FuelCost from './FuelCost';
import styles from './App.module.css';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './rc-slider.css';
import VehicleDetails from "./VehicleDetails";


/*
TODO

* Separate out more components within VehicleDetails.
* Remove natural gas and propane vehicles.
* Come up with better name for the title.
* Summary under chart
* Note in writeup that it excludes natural gas and propane vehicles.
* Add context (e.g. data source is EPA, how to interpret, etc.).
* WRITE UNIT TESTS.
* Add CO2 emissions feature.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      milesPerYear: 12000,
      fuel2MilesPct: {},
      fuelCostDollars: {
        'Regular Gasoline': 3.00,
        'Midgrade Gasoline': 3.25,
        'Premium Gasoline': 3.50,
        'E85': 3.00,
        Diesel: 3.50,
        Electricity: 0.10
      },
      vehiclePrices: {},
      selectedVehicles: [],
      selectedFilters: {
        year: {label: undefined, value: undefined},
        make: {label: undefined, value: undefined},
        model: {label: undefined, value: undefined},
      },
      availableFilters: {
        year: [],
        make: [],
        model: [],
      },
      matchingVehicles: [],
      chartData: []
    };

    this.handleSelectorsChanged = this.handleSelectorsChanged.bind(this);
    this.handleVehicleSelected = this.handleVehicleSelected.bind(this);
    this.deselectVehicle = this.deselectVehicle.bind(this);
    this.handleUpdatePrice = this.handleUpdatePrice.bind(this);
    this.onUpdateFuelCost = this.onUpdateFuelCost.bind(this);
    this.handleUpdateMiles = this.handleUpdateMiles.bind(this);
    this.handleUpdateFuel2MilesPct = this.handleUpdateFuel2MilesPct.bind(this);
  }

  componentDidMount() {
    this.setState({
      availableFilters: {
        year: getYears().map(v => {
          return {label: v, value: v}
        }),
        make: [],
        model: [],
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.selectedVehicles !== this.state.selectedVehicles ||
      prevState.vehiclePrices !== this.state.vehiclePrices ||
      prevState.fuelCostDollars !== this.state.fuelCostDollars ||
      prevState.milesPerYear !== this.state.milesPerYear ||
      prevState.fuel2MilesPct !== this.state.fuel2MilesPct
    ) {
      this.updateChart(this.state);
    }
  }

  requiredFieldsPresent() {
    return Object.keys(this.state.selectedFilters)
      .map(k => !!this.state.selectedFilters[k].value)
      .filter(v => v === true)
      .length === 3;
  }

  handleSelectorsChanged(updatedObj) {
    const selectedFilters = Object.assign({}, this.state.selectedFilters);
    selectedFilters[updatedObj.name] = updatedObj.option;

    // Fetch makes if year changed.
    if (updatedObj.name === 'year') {
      (async () => {
        this.setState({isLoading: true});

        const makes = await getMakes(updatedObj.option.value);
        const makeOptions = makes.map(v => {
          return {label: v, value: v}
        });
        const availableFilters = Object.assign({}, this.state.availableFilters);
        availableFilters.make = makeOptions;
        this.setState({availableFilters});

        // Reset make and model.
        selectedFilters.make = {label: undefined, value: undefined};
        selectedFilters.model = {label: undefined, value: undefined};

        this.setState({isLoading: false, matchingVehicles: []});
      })();
    }

    // Fetch models if make changed.
    else if (updatedObj.name === 'make') {
      (async () => {
        this.setState({isLoading: true});

        const availableFilters = Object.assign({}, this.state.availableFilters);
        const models = await getModels(
          this.state.selectedFilters.year.value,
          updatedObj.option.value
        );
        availableFilters.model = models.map(v => {
          return {label: v, value: v};
        });
        this.setState({availableFilters});
        this.setState({isLoading: false, matchingVehicles: []});
      })();

      selectedFilters.model = {label: undefined, value: undefined};
    }

    // Fetch matching vehicles only if year, make, and model are all selected.
    else if (selectedFilters.year.value && selectedFilters.make.value && selectedFilters.model.value) {
      (async () => {
        this.setState({isLoading: true});
        const matchingVehicles = await getMatchingVehicles(selectedFilters);
        this.setState({matchingVehicles: matchingVehicles});
        this.setState({isLoading: false});
      })();
    }

    this.setState({selectedFilters});
  }

  getElectricCostPerMile(vehicle) {
    return this.state.fuelCostDollars.Electricity * (vehicle.kwh100Miles / 100);
  }

  getHydrocarbonCostPerMile(fuelType, mpg) {
    return this.state.fuelCostDollars[fuelType] / mpg;
  }

  getCostPerYear(vehicle) {
    let fuel2Cost = 0;

    if (vehicle.fuelType2) {
      const fuel2MilesPct = (this.state.fuel2MilesPct[vehicle.id] || 0) / 100;
      const fuel2Miles = fuel2MilesPct * this.state.milesPerYear;
      let dollarsPerMile;

      if (vehicle.fuelType2 === 'Electricity') {
        dollarsPerMile = this.getElectricCostPerMile(vehicle);
      } else {
        dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType2, vehicle.combMpgFuel2);
      }

      fuel2Cost = dollarsPerMile * fuel2Miles;
    }

    const fuel1MilesPct = 1 - ((this.state.fuel2MilesPct[vehicle.id] || 0) / 100);
    const fuel1Miles = fuel1MilesPct * this.state.milesPerYear;
    let dollarsPerMile;

    if (vehicle.fuelType1 === 'Electricity') {
      dollarsPerMile = this.getElectricCostPerMile(vehicle);
    } else {
      dollarsPerMile = this.getHydrocarbonCostPerMile(vehicle.fuelType1, vehicle.combMpgFuel1);
    }

    const fuel1Cost = dollarsPerMile * fuel1Miles;

    return fuel1Cost + fuel2Cost;
  }

  updateChart(state) {
    if (!state.selectedVehicles || state.selectedVehicles.length < 1) {
      this.setState({chartData: []});
      return;
    }

    const chartData = state.selectedVehicles.map(vehicle => {
      const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const data = [];

      let dollarsPerYear = this.getCostPerYear(vehicle);
      const currYear = new Date().getFullYear();
      let prevYearCost = this.state.vehiclePrices[vehicle.id] || 0;

      for (let year = currYear; year <= currYear + 20; year++) {
        let thisYearCost = prevYearCost + dollarsPerYear;
        data.push({category: year, value: thisYearCost});
        prevYearCost = thisYearCost;
      }

      return {name, data};

    });

    this.setState({chartData});
  }

  handleVehicleSelected(vehicleId) {
    const vehicle = this.state.matchingVehicles.find((v) => v.id === parseInt(vehicleId));
    this.setState((state) => {
      // Don't allow selecting the same vehicle again.
      if (state.selectedVehicles.filter((v) => v.id === parseInt(vehicleId)).length > 0) {
        return
      }

      const selectedVehicles = [...state.selectedVehicles, vehicle];
      return {selectedVehicles};
    });
  }

  deselectVehicle(vehicleId) {
    this.setState((state) => {
      return {selectedVehicles: state.selectedVehicles.filter((v) => v.id !== vehicleId)};
    });
  }

  handleUpdatePrice(vehicleId, price) {
    this.setState(prevState => {
      const vehiclePrices = Object.assign({}, prevState.vehiclePrices);
      vehiclePrices[vehicleId] = price;
      return {vehiclePrices};
    });
  }

  onUpdateFuelCost(fuelType, dollars) {
    this.setState(prevState => {
      const fuelCostDollars = Object.assign({}, prevState.fuelCostDollars);
      fuelCostDollars[fuelType] = dollars;
      return {fuelCostDollars};
    });
  }

  handleUpdateMiles(miles) {
    this.setState({milesPerYear: parseInt(miles)});
  }

  handleUpdateFuel2MilesPct(id, pct) {
    const fuel2MilesPct = Object.assign({}, this.state.fuel2MilesPct);
    fuel2MilesPct[id] = parseInt(pct);
    this.setState({fuel2MilesPct});
  }

  render() {
    return (
      <div className={styles.collapsibleContainer}>
        <div className={styles.introContainer}>
          <h1>Vehicle Cost Calculator</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id mollis urna. Aliquam pulvinar ornare
            commodo. Duis euismod enim quis ante tincidunt, vel efficitur diam rhoncus. Nunc luctus purus libero,
            quis egestas odio pretium vel. Vestibulum elit dolor, convallis ullamcorper mauris in, tincidunt placerat
            mi. Cras finibus lobortis felis, non congue diam ultricies sit amet. Sed sed imperdiet nisl. Nunc dui eros,
            pharetra sed mattis eget, malesuada quis felis. Proin vestibulum, erat ut tincidunt congue, massa magna
            faucibus tellus, et rutrum felis ex at lacus.</p>
        </div>
        <div className={styles.calculatorContainer}>
          {
            !this.state.chartData.length ?
              null :
              <VehicleChart series={this.state.chartData}/>
          }
          <Filters
            options={this.state.availableFilters}
            values={this.state.selectedFilters}
            onChange={this.handleSelectorsChanged}
            isDisabled={this.state.isLoading}
          />

          <div>
            <p className={`${styles.instructions} ${styles.large}`}>2. Select vehicles</p>
            <ResultsList
              values={this.state.matchingVehicles}
              selectedVehicles={this.state.selectedVehicles}
              onClick={this.handleVehicleSelected}
              onUpdatePrice={this.onUpdatePrice}
              vehiclePrices={this.state.vehiclePrices}
            />
            {
              !this.state.matchingVehicles.length
              ?
                <p>Search for vehicles to get started.</p>
                : null
            }
          </div>
          <div>
            <p className={`${styles.instructions} ${styles.large}`}>3. Add your details</p>
            <VehicleDetails
              selectedVehicles={this.state.selectedVehicles}
              onDeselectVehicle={this.deselectVehicle}
              onUpdatePrice={this.handleUpdatePrice}
              vehiclePrices={this.state.vehiclePrices}
              fuel2MilesPct={this.state.fuel2MilesPct}
              onUpdateFuel2MilesPct={this.handleUpdateFuel2MilesPct}
            />
            <FuelCost
              visibleFuelTypes={[
                ...new Set([
                  ...this.state.selectedVehicles.map(v => v.fuelType1),
                  ...this.state.selectedVehicles.map(v => v.fuelType2),
                ].filter(t => !!t)),
              ]}
              prices={this.state.fuelCostDollars}
              onChange={this.onUpdateFuelCost}
            />
            <div className={styles.subsection}>
              <p className={styles.instructions}>Miles driven per year: {this.state.milesPerYear}</p>
              <Slider
                min={0}
                max={100000}
                step={500}
                value={this.state.milesPerYear}
                onChange={this.handleUpdateMiles}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
