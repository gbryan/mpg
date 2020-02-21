import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const colors = [
  '#8884d8',
  '#82ca9d',
  '#ca536e',
  '#bb63ca',
  '#ca9878',
  '#6e80ca',
];
const numColors = colors.length;

class RotatedAxisTick extends PureComponent {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={10} dy={0} textAnchor="start" fill="#666" transform="rotate(35)">{payload.value}</text>
      </g>
    );
  }
}

class VehicleChart extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} tick={<RotatedAxisTick />} />
          <YAxis dataKey="value" tickFormatter={dollars => {
            return currencyFormatter.format(dollars);
          }}/>
          <Tooltip formatter={val => {return currencyFormatter.format(val)}} />
          <Legend />
          {this.props.series.map((s, i) => (
            <Line dataKey="value" data={s.data} name={s.name} key={s.name} stroke={colors[i % numColors]} />
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
