import React from 'react';
import { Shield, AlertTriangle, Users, Settings, Activity, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface User {
  username: string;
  role: string;
}

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/dashboard' },
    { id: 'violations', label: 'Violations', icon: AlertTriangle, path: '/violations' },
    { id: 'workers', label: 'Workers', icon: Users, path: '/workers' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b-4 border-yellow-500 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SafetyWatch Pro</h1>
              <p className="text-xs text-gray-600">Real-time Worker Safety Monitor</p>
            </div>
          </Link>
          
          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPath === item.id
                      ? 'bg-yellow-500 text-black shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Live Status */}
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">Live</span>
            </div>

            {/* User Info and Logout */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border">
                  <div className="bg-yellow-500 p-1 rounded-full">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="text-gray-500 capitalize text-xs">{user.role}</div>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-gray-200 hover:border-red-200"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;