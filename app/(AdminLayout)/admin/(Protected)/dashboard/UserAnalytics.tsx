// components/UserLoginAnalytics.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import MetricCard from './MetricCard';
import Image from 'next/image';

interface MetricData {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

const UserLoginAnalytics: React.FC = () => {
  const metrics: MetricData[] = [
    {
      title: "Total Users Logged in Today",
      value: "4.16%",
      icon: "👤",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    },
    {
      title: "Active Users",
      value: "3.48%",
      icon: "👤",
      bgColor: "bg-white", 
      textColor: "text-gray-900"
    },
    {
      title: "Old Users",
      value: "8.25%",
      icon: "👤",
      bgColor: "bg-primary",
      textColor: "text-white"
    },
    {
      title: "New Users",
      value: "8.25%",
      icon: "👤",
      bgColor: "bg-primary",
      textColor: "text-white"
    },
    {
      title: "Login Attempts",
      value: "3.48%",
      icon: "↗️",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    },
    {
      title: "Login Attempts (Successful)",
      value: "40%",
      icon: "✅",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className=" rounded-lg flex items-center justify-center">
          {/* <span className="text-white text-lg"></span> */}
          <Image src="/images/admin/UserAnalytics.svg" alt="Icon" width={16} height={16} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">User Login Analytics</h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            bgColor={metric.bgColor}
            textColor={metric.textColor}
          />
        ))}
      </div>
    </div>
  );
};

export default UserLoginAnalytics;