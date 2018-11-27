import React from 'react';
import { Sector, Cell, PieChart, Pie } from 'recharts';
import './GaugeChart.scss';

const GaugeChart = ({ gasValue }) => {
  const width = 120;
  const height = 120;
  const chartValue = gasValue < 187 ? gasValue : 187;
  const colorData = [
    {
      value: 40, // Meaning span is 0 to 40
      color: 'red',
    },
    {
      value: 100, // span 40 to 140
      color: '#F5C023',
    },
    {
      value: 50, // span 140 to 190
      color: '#A6BF4C',
    },
  ];

  const activeSectorIndex = colorData
    .map((cur, index, arr) => {
      const curMax = [...arr]
        .splice(0, index + 1)
        .reduce((a, b) => ({ value: a.value + b.value })).value;
      return chartValue > curMax - cur.value && chartValue <= curMax;
    })
    .findIndex((cur) => cur);

  const sumValues = colorData.map((cur) => cur.value).reduce((a, b) => a + b);

  const arrowData = [
    { value: chartValue },
    { value: 0 },
    { value: sumValues - chartValue },
  ];

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    cx: width / 2,
    cy: width / 2,
  };

  const pieRadius = {
    innerRadius: width * 0.25,
    outerRadius: width * 0.35,
  };

  const Arrow = ({ cx, cy, midAngle, outerRadius }) => {
    //eslint-disable-line react/no-multi-comp
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + width * 0.03) * cos;
    const my = cy + (outerRadius + width * 0.03) * sin;
    return (
      <g>
        <circle cx={cx} cy={cy} r={width * 0.05} fill="#5f5fff" stroke="none" />
        <path
          d={`M${cx},${cy}L${mx},${my}`}
          strokeWidth="2"
          stroke="#5f5fff"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  };

  const ActiveSectorMark = ({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  }) => {
    //eslint-disable-line react/no-multi-comp
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius * 1.2}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <PieChart width={width} height={height}>
      <Pie
        dataKey="value"
        activeIndex={activeSectorIndex}
        activeShape={ActiveSectorMark}
        data={colorData}
        fill="#8884d8"
        {...pieRadius}
        {...pieProps}
      >
        {colorData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colorData[index].color} />
        ))}
      </Pie>
      <Pie
        dataKey="value"
        stroke="none"
        activeIndex={1}
        activeShape={Arrow}
        data={arrowData}
        outerRadius={pieRadius.innerRadius}
        fill="none"
        {...pieProps}
      />
    </PieChart>
  );
};

export default GaugeChart;
