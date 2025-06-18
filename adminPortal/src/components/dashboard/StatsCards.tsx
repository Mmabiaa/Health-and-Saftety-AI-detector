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
      color: 'emerald',
      trend: 'stable'
    },
    {
      title: 'Safety Score',
      value: '94%',
      change: '+3% this week',
      icon: Shield,
      color: 'emerald',
      trend: 'up'
    },
    {
      title: 'Active Cameras',
      value: '8/10',
      change: '2 offline',
      icon: Camera,
      color: 'amber',
      trend: 'stable'
    },
    {
      title: 'Response Time',
      value: '12s',
      change: 'Avg alert response',
      icon: Clock,
      color: 'slate',
      trend: 'down'
    },
    {
      title: 'Daily Compliance',
      value: '87%',
      change: 'PPE adherence rate',
      icon: TrendingUp,
      color: 'emerald',
      trend: 'up'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-700',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      amber: 'bg-amber-50 border-amber-200 text-amber-700',
      slate: 'bg-slate-50 border-slate-200 text-slate-700',
    };
    return colors[color as keyof typeof colors] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  const getIconBgColor = (color: string) => {
    const colors = {
      red: 'bg-red-100',
      emerald: 'bg-emerald-100',
      amber: 'bg-amber-100',
      slate: 'bg-slate-100',
    };
    return colors[color as keyof typeof colors] || 'bg-slate-100';
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
              <div className={`p-3 rounded-lg ${getIconBgColor(stat.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-100 text-emerald-800' :
                stat.trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-slate-100 text-slate-800'
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