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
          {this.props.vehicles.map(v => {
            return (
              <tr
                key={v.id}
                data-vehicle-id={v.id}
                onClick={this.handleClick}
                className={this.isSelected(v.id) ? styles.selected : ''}
              >
                <td>
                  <span className={styles.addBtn}><i className="fas fa-plus-circle"></i></span>
                  <span className={styles.heading}>Year</span>{v.year}
                </td>
                <td><span className={styles.heading}>Make</span>{v.make}</td>
                <td><span className={styles.heading}>Model</span>{v.model}</td>
                <td><span className={styles.heading}>Cylinders</span>{v.cylinders}</td>
                <td><span className={styles.heading}>Displacement</span>{v.displacement}</td>
                <td><span className={styles.heading}>Drive</span>{v.drive}</td>
                <td><span className={styles.heading}>Transmission</span>{v.transmission}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        {
          !this.props.vehicles.length ?
            <p>Search for vehicles to get started.</p>
            : null
        }
      </div>
    );
  }
}

ResultsList.propTypes = {
  vehicles: PropTypes.array.isRequired,
  selectedVehicles: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ResultsList;
