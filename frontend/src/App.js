import React, {Component} from 'react';
import Filters from './Filters';
import ResultsList from './ResultsList';
import {getMakes, getMatchingVehicles, getModels, getYears} from './VehicleService';
import FuelCost from './FuelCost';
import styles from './App.module.css';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './rc-slider.css';
import VehicleDetails from './VehicleDetails';
import VehicleChartWrapper from './VehicleChartWrapper';


/*
TODO

* Remove natural gas and propane vehicles.
* Come up with better name for the title.
* Summary under chart
* Note in writeup that it excludes natural gas and propane vehicles.
* Add context (e.g. data source is EPA, how to interpret, etc.).
* WRITE UNIT TESTS.
* Update the readme.
* Deploy prod.
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
      filterOptions: {
        year: [],
        make: [],
        model: [],
      },
      filterValues: {
        year: {label: undefined, value: undefined},
        make: {label: undefined, value: undefined},
        model: {label: undefined, value: undefined},
      },
      matchingVehicles: [],
    };

    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
    this.handleVehicleSelected = this.handleVehicleSelected.bind(this);
    this.deselectVehicle = this.deselectVehicle.bind(this);
    this.handleUpdatePrice = this.handleUpdatePrice.bind(this);
    this.onUpdateFuelCost = this.onUpdateFuelCost.bind(this);
    this.handleUpdateMiles = this.handleUpdateMiles.bind(this);
    this.handleUpdateFuel2MilesPct = this.handleUpdateFuel2MilesPct.bind(this);
  }

  componentDidMount() {
    this.setState({
      filterOptions: {
        year: getYears().map(v => {
          return {label: v, value: v}
        }),
        make: [],
        model: [],
      }
    });
  };

  handleFiltersChanged(updatedFilters) {
    const filterValues = Object.assign({}, this.state.filterValues);
    filterValues[updatedFilters.name] = updatedFilters.option;

    // Fetch makes if year changed.
    if (updatedFilters.name === 'year') {
      (async () => {
        this.setState({isLoading: true});

        const makes = await getMakes(updatedFilters.option.value);
        const makeOptions = makes.map(v => {
          return {label: v, value: v}
        });
        const filterOptions = Object.assign({}, this.state.filterOptions);
        filterOptions.make = makeOptions;
        this.setState({filterOptions});

        // Reset make and model.
        filterValues.make = {label: undefined, value: undefined};
        filterValues.model = {label: undefined, value: undefined};

        this.setState({isLoading: false, matchingVehicles: []});
      })();
    }

    // Fetch models if make changed.
    else if (updatedFilters.name === 'make') {
      (async () => {
        this.setState({isLoading: true});

        const filterOptions = Object.assign({}, this.state.filterOptions);
        const models = await getModels(
          this.state.filterValues.year.value,
          updatedFilters.option.value
        );
        filterOptions.model = models.map(v => {
          return {label: v, value: v};
        });
        this.setState({filterOptions, isLoading: false, matchingVehicles: []});
      })();

      filterValues.model = {label: undefined, value: undefined};
    }

    // Fetch matching vehicles only if year, make, and model are all selected.
    else if (filterValues.year.value && filterValues.make.value && filterValues.model.value) {
      (async () => {
        this.setState({isLoading: true});
        const matchingVehicles = await getMatchingVehicles(filterValues);
        this.setState({matchingVehicles: matchingVehicles, isLoading: false});
      })();
    }

    this.setState({filterValues});
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
          <VehicleChartWrapper
            fuelCostDollars={this.state.fuelCostDollars}
            fuel2MilesPct={this.state.fuel2MilesPct}
            milesPerYear={this.state.milesPerYear}
            selectedVehicles={this.state.selectedVehicles}
            vehiclePrices={this.state.vehiclePrices}
          />
          <div>
            <p className={`${styles.instructions} ${styles.large}`}>1. Search for vehicles</p>
            <Filters
              options={this.state.filterOptions}
              values={this.state.filterValues}
              onChange={this.handleFiltersChanged}
              isDisabled={this.state.isLoading}
            />
          </div>
          <div>
            <p className={`${styles.instructions} ${styles.large}`}>2. Select vehicles</p>
            <ResultsList
              vehicles={this.state.matchingVehicles}
              selectedVehicles={this.state.selectedVehicles}
              onClick={this.handleVehicleSelected}
              onUpdatePrice={this.onUpdatePrice}
              vehiclePrices={this.state.vehiclePrices}
            />
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
            <div className={`${styles.subsection} ${styles.milesPerYear}`}>
              <p className={`${styles.instructions} ${styles.medium}`}>
                Miles driven per year: {this.state.milesPerYear}
              </p>
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
