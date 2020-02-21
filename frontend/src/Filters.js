import React, {Component} from 'react';
import PropTypes from "prop-types";
import Select from 'react-select';

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
            <div className="filters">
                <p className="instructions large">1. Search for vehicles.</p>
                <Select
                    name="year"
                    value={this.props.values.year}
                    placeholder="Year"
                    options={this.props.options.year}
                    onChange={this.handleChange}
                    isSearchable={true}
                />
                <Select
                    name="make"
                    value={this.props.values.make}
                    placeholder="Make"
                    options={this.props.options.make}
                    onChange={this.handleChange}
                    isSearchable={true}
                />
                <Select
                    name="model"
                    value={this.props.values.model}
                    placeholder="Model"
                    options={this.props.options.model}
                    onChange={this.handleChange}
                    isSearchable={true}
                />
            </div>
        );
    }
}

Filters.propTypes = {
    options: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Filters;
