import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ResultsList extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const vehicleId = e.currentTarget.getAttribute('data-vehicle-id');
        this.props.onClick(vehicleId);
    }

    isSelected(vehicleId) {
        const match = this.props.selectedVehicles.find(v => v.id.toString() === vehicleId.toString());

        return !!match;
    }

    render() {
        return (
            <div>
                <p className="instructions large">2. Select one or more vehicles.</p>
                <table className="results">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Make</th>
                            <th>Model</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.values.map(row => {
                        return (
                            <tr
                              key={row.id}
                              data-vehicle-id={row.id}
                              onClick={this.handleClick}
                              className={this.isSelected(row.id) ? 'selected': ''}
                            >
                                <td>{row.year}</td>
                                <td>{row.make}</td>
                                <td>{row.model}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

ResultsList.propTypes = {
    values: PropTypes.array.isRequired,
    selectedVehicles: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    vehiclePrices: PropTypes.object.isRequired
};

export default ResultsList;
