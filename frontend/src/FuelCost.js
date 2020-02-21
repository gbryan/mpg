import React, {Component} from 'react';
import PropTypes from "prop-types";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

class FuelCost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false
    };

    this.handlePriceUpdated = this.handlePriceUpdated.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.formatPrice = this.formatPrice.bind(this);
  }

  handlePriceUpdated(e) {
    const fuelType = e.currentTarget.getAttribute('data-fuel-type');
    const dollars = e.currentTarget.value;

    this.props.onChange(fuelType, dollars);
  }

  handleFocus() {
    this.setState({isEditing: true});
  }

  handleBlur() {
    this.setState({isEditing: false});
  }

  formatPrice(price) {
    return formatter.format(price);
  }

  render() {
    if (!this.props.visibleFuelTypes.length) {
      return null;
    }

    return (
      <div className="subsection">
        <p className="instructions">Fuel Costs</p>
        {
          this.props.visibleFuelTypes.map((t, key) => (
            <div key={key} className="wrapper spaced-row">
              <div>{t}</div>
              <div>
                {
                  this.state.isEditing ?
                    <input
                      key={key}
                      data-fuel-type={t}
                      type="number"
                      placeholder="$0.00"
                      value={this.props.prices[t]}
                      onChange={this.handlePriceUpdated}
                      onBlur={this.handleBlur}
                    /> :
                    <input
                      key={key}
                      data-fuel-type={t}
                      type="text"
                      placeholder="$0.00"
                      value={this.formatPrice(this.props.prices[t])}
                      onFocus={this.handleFocus}
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
