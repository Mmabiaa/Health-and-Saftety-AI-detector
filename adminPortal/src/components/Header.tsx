import React from 'react';
import { Shield, AlertTriangle, Users, Settings, Activity, TestTube, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'violations', label: 'Violations', icon: AlertTriangle },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'test', label: 'Test', icon: TestTube },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b-4 border-emerald-500 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SafetyWatch Pro</h1>
              <p className="text-xs text-slate-600">Real-time Worker Safety Monitor</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-800">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;