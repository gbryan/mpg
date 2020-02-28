import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styles from './App.module.css';

class Filters extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(option, input) {
        this.props.onChange({
            name: input.name,
            option: option
        });
    }

    render() {
        return (
            <div>
                <p className={`${styles.instructions} ${styles.large}`}>1. Search for vehicles</p>
                <Select
                    name="year"
                    value={!this.props.values.year.value ? null : this.props.values.year}
                    placeholder="Year"
                    options={this.props.options.year}
                    onChange={this.handleChange}
                    isSearchable={true}
                    isDisabled={this.props.isDisabled}
                />
                <Select
                    name="make"
                    value={!this.props.values.make.value ? null : this.props.values.make}
                    placeholder="Make"
                    options={this.props.options.make}
                    onChange={this.handleChange}
                    isSearchable={true}
                    isDisabled={this.props.isDisabled || !this.props.values.year.value}
                />
                <Select
                    name="model"
                    value={!this.props.values.model.value ? null : this.props.values.model}
                    placeholder="Model"
                    options={this.props.options.model}
                    onChange={this.handleChange}
                    isSearchable={true}
                    isDisabled={this.props.isDisabled || !this.props.values.year.value || !this.props.values.make.value}
                />
            </div>
        );
    }
}

Filters.propTypes = {
    options: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
};

export default Filters;
