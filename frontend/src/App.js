import React, {Component} from 'react';
import Filters from './Filters';
import ResultsList from './ResultsList';
import {getMakes, getMatchingVehicles, getModels, getYears} from './VehicleService';
import VehicleChart from './VehicleChart';
import FuelCost from './FuelCost';
import PriceInput from './PriceInput';
import styles from './App.module.css';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './rc-slider.css';


/*
TODO

* Handle "Natural Gas"
* Summary under chart
* Write unit tests.
* Redo it in Typescript.
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            milesPerYear: 10000,
            fuelCostDollars: {
                'Regular Gasoline': 3.00,
                'Midgrade Gasoline': 3.25,
                'Premium Gasoline': 3.50,

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
    }

    componentDidMount() {
        this.setState({
            availableFilters: {
                year: getYears().map(v => { return {label: v, value: v}}),
                make: [],
                model: [],
            }
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedVehicles !== this.state.selectedVehicles ||
            prevState.vehiclePrices !== this.state.vehiclePrices ||
            prevState.fuelCostDollars !== this.state.fuelCostDollars ||
            prevState.milesPerYear !== this.state.milesPerYear
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
                const makeOptions = makes.map(v => { return {label: v, value: v}});
                const availableFilters = Object.assign({}, this.state.availableFilters);
                availableFilters.make = makeOptions;
                this.setState({availableFilters});

                // Reset make and model.
                selectedFilters.make = {label: undefined, value: undefined};
                selectedFilters.model = {label: undefined, value: undefined};

                this.setState({isLoading: false});
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
                availableFilters.model = models.map(v => {return {label: v, value: v};});
                this.setState({availableFilters});
                this.setState({isLoading: false});
            })();

            selectedFilters.model = {label: undefined, value: undefined};
        }

        this.setState({selectedFilters});

        // Fetch matching vehicles only if year, make, and model are all selected.
        if (selectedFilters.year.value && selectedFilters.make.value && selectedFilters.model.value) {
            (async () => {
                this.setState({isLoading: true});
                const matchingVehicles = await getMatchingVehicles(selectedFilters);
                this.setState({matchingVehicles: matchingVehicles});
                this.setState({isLoading: false});
            })();
        }
    }

    updateChart(state) {
        if (!state.selectedVehicles || state.selectedVehicles.length < 1) {
            this.setState({chartData: []});
            return;
        }

        const chartData = state.selectedVehicles.map(vehicle => {
            const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
            const data = [];
            let dollarsPerMile;

            if (vehicle.fuelType === 'Electricity') {
                dollarsPerMile = (
                  this.state.fuelCostDollars.Electricity * (vehicle.kwh100Miles / 100));
            } else {
                dollarsPerMile = this.state.fuelCostDollars[vehicle.fuelType] / vehicle.mpg;
            }

            let dollarsPerYear = this.state.milesPerYear * dollarsPerMile;
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

    deselectVehicle(e) {
        const vehicleId = parseInt(e.currentTarget.getAttribute('data-vehicle-id'));
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

    render() {
        return (
            <div className={styles.container}>
                <h1>Vehicle Cost Calculator</h1>
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
                {
                    this.requiredFieldsPresent() ?
                    <ResultsList
                        values={this.state.matchingVehicles}
                        selectedVehicles={this.state.selectedVehicles}
                        onClick={this.handleVehicleSelected}
                        onUpdatePrice={this.onUpdatePrice}
                        vehiclePrices={this.state.vehiclePrices}
                    /> : null
                }

                {/*TODO: break into smaller components. */}
                {
                    this.state.selectedVehicles.length ?
                        <div>
                            <p className={`${styles.instructions} ${styles.large}`}>3. Add your details</p>
                            <div className={styles.subsection}>
                                <p className={styles.instructions}>Purchase Price</p>
                                {this.state.selectedVehicles.map((v) => {
                                    return (
                                        <div key={v.id} className={`${styles.wrapper} ${styles.spacedRow}`}>
                                            <div className={styles.boxLabelContainer}>
                                                <div className={styles.boxLabel}>
                                                    <button
                                                      className={`${styles.delete} ${styles.btnLeft}`}
                                                      data-vehicle-id={v.id}
                                                      onClick={this.deselectVehicle}
                                                    ><i className="fas fa-trash"></i></button>
                                                </div>
                                                {v.year} {v.make} {v.model}
                                            </div>
                                            <div className={styles.boxLabelContainer}>
                                                <PriceInput
                                                  placeholder="Enter the purchase price."
                                                  onChange={this.handleUpdatePrice}
                                                  value={this.state.vehiclePrices[v.id] || ''}
                                                  fieldId={v.id}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <FuelCost
                                visibleFuelTypes={[...new Set(this.state.selectedVehicles.map(v => v.fuelType))]}
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
                      : null
                }
            </div>
        );
    }
}

export default App;
