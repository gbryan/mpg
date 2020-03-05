import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class ZipCodeInput extends PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const origVal = e.target.value;
    const cleanVal = origVal.replace(/\D/,'');
    this.props.onChange(cleanVal);
  }

  render() {
    return (
      <input
        type="text"
        maxLength={5}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}

ZipCodeInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ZipCodeInput;
