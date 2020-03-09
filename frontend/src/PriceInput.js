import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {parseNumeric} from './utils';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

class PriceInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
  }

  toCurrency(number) {
    if (number === '') {
      return number;
    }

    return formatter.format(number);
  }

  toggleEditable() {
    this.setState(prevState => {
      return {isEditable: !prevState.isEditable};
    })
  }

  handleChange(e) {
    const id = e.currentTarget.getAttribute('data-id');

    try {
      const dollars = parseNumeric(e.currentTarget.value);
      this.props.onChange(id, parseFloat(dollars));
    } catch {}
  }

  render() {
    if (this.state.isEditable) {
      return (
        <input
          style={{width: 150}}
          type="text"
          pattern="[0-9.]*"
          value={this.props.value}
          onChange={this.handleChange}
          onBlur={this.toggleEditable}
          data-id={this.props.fieldId}
        />
      );
    }

    return (
      <input
        style={{width: 150}}
        type="text"
        placeholder={this.props.placeholder}
        value={this.toCurrency(this.props.value)}
        onFocus={this.toggleEditable}
        data-id={this.props.fieldId}
        readOnly={true}
      />
    );
  }
}

PriceInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  fieldId: PropTypes.any
};

export default PriceInput;
