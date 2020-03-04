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
import BackLinkHeader from './BackLinkHeader';


/*
TODO

* Currently, emissions are based on national median carbon intensity for vehicles that use
electricity as a fuel type. This is not precise because
CO2 emissions will be based on the grid mix at the user's location where they charge the
vehicle. Pull in a data set of carbon intensity by zip code, and use it for calculation.
* Use constants for fuel types.
* Add Google Analytics.
* Add context about what this calculator does.
* Summary under chart, including info about how to interpret
* Update the readme with link to prod.
* Remove temp robots.txt that I set up to block crawling.
* Deploy prod.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      co2eLbsMwh: 1086.2, // initially set to national average
      zipCode: null,
      milesPerYear: 12000,
      fuel2MilesPct: {},
      isShowingFuelCost: true,
      fuelCostsDollars: {
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
    this.onToggleShowFuelCost = this.onToggleShowFuelCost.bind(this);
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
      const fuelCostsDollars = Object.assign({}, prevState.fuelCostsDollars);
      fuelCostsDollars[fuelType] = dollars;
      return {fuelCostsDollars};
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

  onToggleShowFuelCost(showFuelCost) {
    this.setState({isShowingFuelCost: showFuelCost});
  }

  render() {
    return (
      <div>
        <BackLinkHeader queryString={window.location.search}/>
        <div className={styles.collapsibleContainer}>
          <div className={styles.introContainer}>
            <h1>Vehicle Fuel Cost and CO<sub>2</sub> Emissions Calculator</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id mollis urna. Aliquam pulvinar ornare
              commodo. Duis euismod enim quis ante tincidunt, vel efficitur diam rhoncus. Nunc luctus purus libero,
              quis egestas odio pretium vel. Vestibulum elit dolor, convallis ullamcorper mauris in, tincidunt placerat
              mi. Cras finibus lobortis felis, non congue diam ultricies sit amet. Sed sed imperdiet nisl. Nunc dui eros,
              pharetra sed mattis eget, malesuada quis felis. Proin vestibulum, erat ut tincidunt congue, massa magna
              faucibus tellus, et rutrum felis ex at lacus.
            </p>
            <p className={styles.finePrint}>
              Data source:
              &nbsp;<a href="https://www.fueleconomy.gov/feg/download.shtml" target="_blank" rel="noopener noreferrer">
                U.S. Department of Energy Fuel Economy Data 1984-2020
              </a>, downloaded 2020-01-28
            </p>
            <p className={styles.finePrint}>
              Vehicles with a primary or secondary fuel type of natural gas or propane were excluded.
            </p>
          </div>
          <div className={styles.calculatorContainer}>
            <VehicleChartWrapper
              onToggleShowFuelCost={this.onToggleShowFuelCost}
              isShowingFuelCost={this.state.isShowingFuelCost}
              fuelCostsDollars={this.state.fuelCostsDollars}
              fuel2MilesPct={this.state.fuel2MilesPct}
              milesPerYear={this.state.milesPerYear}
              selectedVehicles={this.state.selectedVehicles}
              vehiclePrices={this.state.vehiclePrices}
              co2eLbsMwh={this.state.co2eLbsMwh}
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
              />
            </div>
            <div>
              <p className={`${styles.instructions} ${styles.large}`}>3. Add your details</p>
              <VehicleDetails
                selectedVehicles={this.state.selectedVehicles}
                onDeselectVehicle={this.deselectVehicle}
                onUpdatePrice={this.handleUpdatePrice}
                showVehiclePrices={this.state.isShowingFuelCost}
                vehiclePrices={this.state.vehiclePrices}
                fuel2MilesPct={this.state.fuel2MilesPct}
                onUpdateFuel2MilesPct={this.handleUpdateFuel2MilesPct}
              />
              {
                this.state.isShowingFuelCost ?
                <FuelCost
                  visibleFuelTypes={[
                    ...new Set([
                      ...this.state.selectedVehicles.map(v => v.fuelType1),
                      ...this.state.selectedVehicles.map(v => v.fuelType2),
                    ].filter(t => !!t)),
                  ]}
                  prices={this.state.fuelCostsDollars}
                  onChange={this.onUpdateFuelCost}
                />
                : null
              }
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
      </div>
    );
  }
}

export default App;
