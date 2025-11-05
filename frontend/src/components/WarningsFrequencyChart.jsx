import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#F59E0B', '#EF4444', '#6366F1', '#10B981', '#7C3AED', '#F472B6', '#0EA5E9'];

const WarningsFrequencyChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;
  const chartData = Object.entries(data).map(([warning, freq]) => ({ warning, freq }));
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Warnings Frequency</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="warning" width={170} />
          <Tooltip />
          <Bar dataKey="freq" label={{ position: 'right' }}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WarningsFrequencyChart;
