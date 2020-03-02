import React, {Component} from 'react';
import mainStyles from './App.module.css';
import styles from './VehicleDetails.module.css';
import PriceInput from './PriceInput';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';

class VehicleDetails extends Component {
  constructor(props) {
    super(props);

    this.deselectVehicle = this.deselectVehicle.bind(this);
  }

  hasAlternativeFuels() {
    return this.props.selectedVehicles.map(v => v.fuelType2).filter(t => !!t).length;
  }

  deselectVehicle(e) {
    const vehicleId = e.currentTarget.getAttribute('data-vehicle-id');
    this.props.onDeselectVehicle(parseInt(vehicleId));
  }

  render() {
    if (!this.props.selectedVehicles.length) {
      return null;
    }

    return (
      <div className={mainStyles.subsection}>
        <p className={mainStyles.instructions}>
          Purchase Price
          {
            this.hasAlternativeFuels() ?
              ' and Alternative Fuel Usage'
              : null
          }
        </p>
        {this.props.selectedVehicles.map((v) => {
          return (
            <div key={v.id} className={`${mainStyles.wrapper} ${mainStyles.spacedRow}`}>
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
                  onChange={this.props.onUpdatePrice}
                  value={this.props.vehiclePrices[v.id] || ''}
                  fieldId={v.id}
                />
              </div>
              {
                v.fuelType2 ?
                  <div className={`${styles.fuel2Pct} ${styles.boxLabelContainer}`}>
                    <p>
                      Miles driven using {
                      v.fuelType2 === 'E85' ?
                        v.fuelType2 :
                        v.fuelType2.toLowerCase()
                    }:
                      &nbsp;{this.props.fuel2MilesPct[v.id] || 0}%
                    </p>
                    <Slider
                      key={v.id}
                      min={0}
                      max={100}
                      value={this.props.fuel2MilesPct[v.id] || 0}
                      onChange={this.props.onUpdateFuel2MilesPct.bind(this, v.id)}
                    />
                  </div>
                  : null
              }
            </div>
          );
        })}
      </div>
    );
  }
}

VehicleDetails.propTypes = {
  selectedVehicles: PropTypes.array.isRequired,
  onDeselectVehicle: PropTypes.func.isRequired,
  onUpdatePrice: PropTypes.func.isRequired,
  vehiclePrices: PropTypes.object.isRequired,
  fuel2MilesPct: PropTypes.object.isRequired,
  onUpdateFuel2MilesPct: PropTypes.func.isRequired,
};

export default VehicleDetails;
