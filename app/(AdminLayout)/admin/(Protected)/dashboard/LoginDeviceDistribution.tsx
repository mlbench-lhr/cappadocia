// components/LoginDeviceDistribution.tsx
import React from 'react';
import DonutChart from './DonutChart';

const LoginDeviceDistribution: React.FC = () => {
  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' }, // Blue
    { name: 'Mobile', value: 35, color: '#10B981' },  // Green
    { name: 'Tablet', value: 20, color: '#E5E7EB' },  // Gray
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Login Device Distribution
        </h2>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>(</span>
          <span className="text-blue-600 font-medium">Desktop</span>
          <span>/</span>
          <span className="text-green-600 font-medium">Mobile</span>
          <span>/</span>
          <span className="text-gray-400 font-medium">Tablet</span>
          <span>)</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex justify-center items-center h-64">
        <DonutChart data={deviceData} />
      </div>

      {/* Legend (Optional - you can add this if needed) */}
      {/* <div className="mt-6 flex justify-center gap-6">
        {deviceData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default LoginDeviceDistribution;