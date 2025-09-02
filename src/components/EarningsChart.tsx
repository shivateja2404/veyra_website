'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const chartData = [
  { followers: '1K', earnings: [500, 1000], label: '1K' },
  { followers: '5K', earnings: [2500, 5000], label: '5K' },
  { followers: '10K', earnings: [5000, 12000], label: '10K' },
  { followers: '50K', earnings: [25000, 60000], label: '50K' },
  { followers: '100K', earnings: [50000, 120000], label: '100K' },
];

export const EarningsChart = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrency = (value: any) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };

  const tooltipFormatter = (value: any, name: any) => {
    return [`₹${value.toLocaleString()}`, "Earnings"];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const minValue = payload[0].value;
      const maxValue = payload[1].value;
      
      return (
        <div className="p-4 glass rounded-md">
          <p className="font-medium">{label} followers</p>
          <p>₹{minValue.toLocaleString()} - ₹{maxValue.toLocaleString()}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="w-full h-72 sm:h-96">
      {isClient && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
            <XAxis 
              dataKey="label" 
              label={{ value: 'Followers', position: 'insideBottom', offset: -10 }} 
              stroke={theme === 'dark' ? '#ccc' : '#333'}
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              label={{ value: 'Monthly Earnings (₹)', angle: -90, position: 'insideLeft' }}
              stroke={theme === 'dark' ? '#ccc' : '#333'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="earnings[0]" 
              stackId="a" 
              fill="#7044FF50" 
              name="Min Earnings" 
            />
            <Bar 
              dataKey="earnings[1]" 
              stackId="a" 
              fill="#7044FF" 
              name="Max Earnings" 
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
