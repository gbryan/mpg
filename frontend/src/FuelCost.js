import React, {Component} from 'react';
import PropTypes from 'prop-types';
import mainStyles from './App.module.css';
import styles from './FuelCost.module.css';
import {FUEL_TYPES} from './constants';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

class FuelCost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: {}
    };

    this.handlePriceUpdated = this.handlePriceUpdated.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.formatPrice = this.formatPrice.bind(this);
  }

  handlePriceUpdated(e) {
    const fuelType = e.currentTarget.name;
    const dollars = e.currentTarget.value;

    this.props.onChange(fuelType, dollars);
  }

  handleFocus(e) {
    const name = e.currentTarget.name;
    this.setState({isEditing: {[name]: true}});
  }

  handleBlur(e) {
    const name = e.currentTarget.name;
    this.setState({isEditing: {[name]: false}});
  }

  formatPrice(price) {
    return formatter.format(price || 0);
  }

  formatLabel(fuelType) {
    return `${fuelType} (per ${fuelType === FUEL_TYPES.ELECTRICITY ? "kWh" : "gallon"})`;
  }

  render() {
    if (!this.props.visibleFuelTypes.length) {
      return null;
    }

    return (
      <div className={mainStyles.subsection}>
        <p className={`${mainStyles.instructions} ${mainStyles.medium}`}>Fuel Costs</p>
        {
          this.props.visibleFuelTypes.map((t, key) => (
            <div key={key} className={`${styles.wrapper} ${mainStyles.spacedRow}`}>
              <div>{this.formatLabel(t)}</div>
              <div>
                {
                  this.state.isEditing[t] ?
                    <input
                      key={key}
                      name={t}
                      type="number"
                      placeholder={0}
                      value={this.props.prices[t]}
                      onChange={this.handlePriceUpdated}
                      onBlur={this.handleBlur}
                    /> :
                    <input
                      key={key}
                      name={t}
                      type="text"
                      placeholder="$0.00"
                      value={this.formatPrice(this.props.prices[t])}
                      onFocus={this.handleFocus}
                      onClick={this.handleFocus}
                      readOnly={true}
                    />
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

FuelCost.propTypes = {
  visibleFuelTypes: PropTypes.array.isRequired,
  prices: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FuelCost;
