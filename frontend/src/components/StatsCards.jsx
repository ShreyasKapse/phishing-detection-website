import React from 'react';
import { Shield, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Analyses',
      value: stats?.total_analyses || 0,
      icon: BarChart3,
      color: 'blue',
      description: 'URLs analyzed'
    },
    {
      title: 'Safe URLs',
      value: stats?.safe_analyses || 0,
      icon: CheckCircle,
      color: 'green',
      description: `${stats?.safe_percentage || 0}% safe`
    },
    {
      title: 'Phishing Detected',
      value: stats?.phishing_detected || 0,
      icon: AlertTriangle,
      color: 'red',
      description: `${stats?.phishing_percentage || 0}% phishing`
    },
    {
      title: 'Protection Score',
      value: Math.round(stats?.safe_percentage || 0),
      icon: Shield,
      color: 'purple',
      description: 'Overall security'
    }
  ];

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-emerald-200',
    red: 'bg-gradient-to-br from-red-500 to-rose-600 shadow-rose-200',
    purple: 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-indigo-200'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white/80 backdrop-blur rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </div>
            <div className={`${colorClasses[card.color]} p-3 rounded-2xl shadow-inner` }>
              <card.icon className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;