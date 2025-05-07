import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts" ;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const BudgetChart = ({ data }) => {
  const chartData = data.map(cat => ({
    name: cat.category,
    value: cat.spent
  }));

  return (
    <div className="chart">
      <h3>Expense Breakdown</h3>
      <PieChart width={300} height={300}>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default BudgetChart;
