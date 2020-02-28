import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import './recharts.css';


const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const colors = [
  '#6a66ba',
  '#69ab82',
  '#ca536e',
  '#ca9878',
  '#bb63ca',
  '#81a1ca',
];
const numColors = colors.length;

class VehicleChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="category" type="category" allowDuplicatedCategory={false}/>
          <YAxis dataKey="value" tickFormatter={dollars => {
            return currencyFormatter.format(dollars);
          }}/>
          <Tooltip formatter={val => {
            return currencyFormatter.format(val)
          }} labelStyle={{marginBottom: 10}} contentStyle={{whiteSpace: 'normal'}}/>
          <Legend/>
          {this.props.series.map((s, i) => (
            <Line dataKey="value" data={s.data} name={s.name} key={s.name} stroke={colors[i % numColors]}/>
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

VehicleChart.propTypes = {
  series: PropTypes.array.isRequired
};

export default VehicleChart;
