// components/MetricCard.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  bgColor, 
  textColor 
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200`}>
      {/* Header with icon and dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className={`text-sm font-medium ${textColor === 'text-white' ? 'text-white/80' : 'text-gray-600'}`}>
            {title}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 ${textColor === 'text-white' ? 'text-white/60' : 'text-gray-400'} cursor-pointer hover:${textColor === 'text-white' ? 'text-white' : 'text-gray-600'} transition-colors`} 
        />
      </div>

      {/* Value */}
      <div className={`text-3xl font-bold ${textColor}`}>
        {value}
      </div>
    </div>
  );
};

export default MetricCard;