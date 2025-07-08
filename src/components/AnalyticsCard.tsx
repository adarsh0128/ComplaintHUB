import React from "react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon, color }) => (
  <div className={`flex items-center gap-4 bg-white rounded-lg shadow p-4 border-t-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  </div>
);

export default AnalyticsCard;
