import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ZipCodeInput from './ZipCodeInput';
import mainStyles from './App.module.css';
import styles from './GridEmissions.module.css';
import {getGridEmissions} from './VehicleService';

const STATUSES = {
  LOADING: 1,
  INVALID: 2,
  VALID: 3,
};
Object.freeze(STATUSES);

class GridEmissions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      zipCode: '',
      status: STATUSES.INVALID,
    };

    this.handleZipCodeUpdate = this.handleZipCodeUpdate.bind(this);
  }

  getStatusIcon() {
    switch (this.state.status) {
      case STATUSES.VALID:
        return <i className={`fas fa-check ${styles.statusIcon} ${mainStyles.success}`}></i>;
      case STATUSES.LOADING:
        return <i className={`fas fa-spinner ${styles.statusIcon}`}></i>;
      default:
        return <i className={`fas fa-times ${styles.statusIcon} ${mainStyles.warning}`}></i>;
    }
  }

  handleZipCodeUpdate(zipCode) {
    this.setState({zipCode});

    if (zipCode.length === 5) {
      this.setState({status: STATUSES.LOADING});
      
      (async () => {
        let avgCo2eLbsMwh = await getGridEmissions(zipCode);

        if (!avgCo2eLbsMwh) {
          this.setState({status: STATUSES.INVALID});
          avgCo2eLbsMwh = this.props.defaultCo2eLbsMwh;
        } else {
          this.setState({status: STATUSES.VALID});
        }

        this.props.onChange(avgCo2eLbsMwh);
      })();
    } else {
      this.setState({status: STATUSES.INVALID});
    }
  }

  render() {
    return (
      <div className={mainStyles.subsection}>
        <p className={`${mainStyles.instructions} ${mainStyles.medium}`}>Zip Code</p>
        <p>Emissions data use a default value. Enter your zip code to personalize.</p>
        <div>
          <ZipCodeInput
            onChange={this.handleZipCodeUpdate}
            value={this.state.zipCode}
            placeholder="Enter your zip code."
          />
          {this.getStatusIcon()}
        </div>
      </div>
    );
  }
}

GridEmissions.propTypes = {
  defaultCo2eLbsMwh: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GridEmissions;
