import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export default function RoundChart(props = null) {
  const width = props.width || 200;
  const height = props.height || 200;
  const data = props.data || [];
  const colors = props.colors || [];
  const isDisplayLabel = props.isDisplayLabel || false;

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        cx={(width / 2)}
        cy={(height / 2)}
        innerRadius={(width / 2) - (width * 0.2)}
        outerRadius={(width / 2) - (width * 0.1)}
        fill="#8884d8"
        label={isDisplayLabel}
        paddingAngle={5}
        dataKey="value"
      >
        {
          data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
        }
      </Pie>
    </PieChart>
  );
}

