import React from 'react';

// Types
interface StatCardProps {
  title: string;
  amount: string;
  percentageChange: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, percentageChange }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex-1">
      <div className="text-sm font-semibold text-black mb-2">
        {title}
      </div>
      <div className="text-3xl font-bold text-black mb-2">
        {amount}
      </div>
      <div className="text-sm text-green-500 flex items-center gap-1">
        <span>↑</span>
        <span>{percentageChange}</span>
      </div>
    </div>
  );
};

export default StatCard;