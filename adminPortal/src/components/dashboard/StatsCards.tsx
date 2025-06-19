import React from 'react';
import { AlertTriangle, Shield, Camera, Users, TrendingUp, Clock } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Active Violations',
      value: '3',
      change: '+2 from yesterday',
      icon: AlertTriangle,
      color: 'red',
      trend: 'up'
    },
    {
      title: 'Workers Detected',
      value: '47',
      change: '12 currently active',
      icon: Users,
      color: 'blue',
      trend: 'stable'
    },
    {
      title: 'Safety Score',
      value: '94%',
      change: '+3% this week',
      icon: Shield,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Active Cameras',
      value: '8/10',
      change: '2 offline',
      icon: Camera,
      color: 'yellow',
      trend: 'stable'
    },
    {
      title: 'Response Time',
      value: '12s',
      change: 'Avg alert response',
      icon: Clock,
      color: 'purple',
      trend: 'down'
    },
    {
      title: 'Daily Compliance',
      value: '87%',
      change: 'PPE adherence rate',
      icon: TrendingUp,
      color: 'indigo',
      trend: 'up'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${getColorClasses(stat.color)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color === 'red' ? 'bg-red-100' : 
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'yellow' ? 'bg-yellow-100' :
                stat.color === 'purple' ? 'bg-purple-100' : 'bg-indigo-100'}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-green-100 text-green-800' :
                stat.trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm font-medium mb-2">{stat.title}</p>
              <p className="text-xs opacity-75">{stat.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;