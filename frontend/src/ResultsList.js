import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './ResultsList.module.css';

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
        <table className={styles.results}>
          <thead>
          <tr>
            <th>Year</th>
            <th>Make</th>
            <th>Model</th>
            <th>Cylinders</th>
            <th>Displacement</th>
            <th>Drive</th>
            <th>Transmission</th>
          </tr>
          </thead>
          <tbody>
          {this.props.values.map(row => {
            return (
              <tr
                key={row.id}
                data-vehicle-id={row.id}
                onClick={this.handleClick}
                className={this.isSelected(row.id) ? styles.selected : ''}
              >
                <td>
                  <span className={styles.addBtn}><i className="fas fa-plus-circle"></i></span>
                  <span className={styles.heading}>Year</span>{row.year}
                </td>
                <td><span className={styles.heading}>Make</span>{row.make}</td>
                <td><span className={styles.heading}>Model</span>{row.model}</td>
                <td><span className={styles.heading}>Cylinders</span>{row.cylinders}</td>
                <td><span className={styles.heading}>Displacement</span>{row.displacement}</td>
                <td><span className={styles.heading}>Drive</span>{row.drive}</td>
                <td><span className={styles.heading}>Transmission</span>{row.transmission}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        {
          !this.props.values.length ?
            <p>Search for vehicles to get started.</p>
            : null
        }
      </div>
    );
  }
}

ResultsList.propTypes = {
  values: PropTypes.array.isRequired,
  selectedVehicles: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  vehiclePrices: PropTypes.object.isRequired,
};

export default ResultsList;
