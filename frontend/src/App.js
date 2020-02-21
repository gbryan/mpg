import React, {Component} from 'react';
import {SpinnerComponent, SpinnerPositionEnum} from 'react-element-spinner';
import Filters from './Filters';
import ResultsList from './ResultsList';
import {getMatchingVehicles} from './VehicleService';
import VehicleChart from './VehicleChart';
import FuelCost from './FuelCost';
import PriceInput from './PriceInput';
import './App.css';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

/*
TODO

* Mock out server response for chart data.
* Fetch actual search results from server.
* Summary under chart
* Write unit tests.
* Redo it in Typescript.
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            milesPerYear: 10000,
            fuelCostDollars: {
                'Regular Gasoline': 3.00,

                // TODO: not sure this is the exact label.
                // TODO: What about premium gas? Are there other distinct values?
                Diesel: 3.50,
                Electricity: 0.10
            },
            vehiclePrices: {},
            selectedVehicles: [],
            selectedFilters: {},
            availableFilters: {},
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
        //TODO: fetch values from server.
        (async () => {
            this.setState({
                availableFilters: {
                    year: [2020, 2019, 2018, 2017].map((v) => { return {label: v, value: v}}),
                    make: ['Toyota', 'Honda'].map((v) => { return {label: v, value: v}}),
                    model: ['Corolla Hybrid', 'Corolla Hatchback', 'Camry XLE'].map(
                        (v) => { return {label: v, value: v}})
                }
            });

            //TODO: force user to select at least one filter before displaying any results.
            const matchingVehicles = await getMatchingVehicles(this.state.selectedFilters);
            this.setState({matchingVehicles: matchingVehicles});

            this.setState({isLoading: false});
        })();
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

    handleSelectorsChanged(updatedObj) {
        const newState = Object.assign({}, this.state);
        newState.selectedFilters[updatedObj.name] = updatedObj.option;
        this.setState(newState);

        (async () => {
            this.setState({isLoading: true});
            const matchingVehicles = await getMatchingVehicles(newState.selectedFilters);
            this.setState({matchingVehicles: matchingVehicles});
            this.setState({isLoading: false});
        })();
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
                  this.state.fuelCostDollars.Electricity * (vehicle.kwh100m / 100));
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
        if (this.state.isLoading) {
            return <SpinnerComponent loading={true} position={SpinnerPositionEnum.GLOBAL}/>;
        }

        return (
            <div className="container">
                <h1>Vehicle Cost Calculator</h1>
                {
                    !this.state.chartData.length ?
                      null
                      // <div className="chart-placeholder">
                      //     <div>Select a vehicle to get started.</div>
                      // </div>
                      :
                      <VehicleChart series={this.state.chartData}/>
                }
                <Filters
                    options={this.state.availableFilters}
                    values={this.state.selectedFilters}
                    onChange={this.handleSelectorsChanged}
                />
                <ResultsList
                    values={this.state.matchingVehicles}
                    selectedVehicles={this.state.selectedVehicles}
                    onClick={this.handleVehicleSelected}
                    onUpdatePrice={this.onUpdatePrice}
                    vehiclePrices={this.state.vehiclePrices}
                />
                <p className="instructions large">3. Add your details</p>
                {
                    this.state.selectedVehicles.length ?
                    <div className="subsection">
                        <p className="instructions">Purchase Price</p>
                        {this.state.selectedVehicles.map((v) => {
                            return (
                                <div key={v.id} className="wrapper spaced-row">
                                    <div className="box-label-container">
                                        <div className="box-label">
                                            <button
                                              className="btn btn-left delete"
                                              data-vehicle-id={v.id}
                                              onClick={this.deselectVehicle}
                                            ><i className="fas fa-trash"></i></button>
                                        </div>
                                        {v.make} {v.model} {v.year} super long-ass name
                                    </div>
                                    <div className="box-label-container">
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
                    </div> : null
                }
                <FuelCost
                    visibleFuelTypes={[...new Set(this.state.selectedVehicles.map(v => v.fuelType))]}
                    prices={this.state.fuelCostDollars}
                    onChange={this.onUpdateFuelCost}
                />
                <div className="subsection">
                    <p className="instructions">Miles driven per year: {this.state.milesPerYear}</p>
                    <Slider
                      min={0}
                      max={100000}
                      step={500}
                      value={this.state.milesPerYear}
                      onChange={this.handleUpdateMiles}
                    />
                </div>
            </div>
        );
    }
}

export default App;
