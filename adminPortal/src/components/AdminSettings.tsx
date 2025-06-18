import React, { useState } from 'react';
import { Settings, Camera, Shield, Bell, Users, Save, AlertTriangle } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('cameras');

  const sections = [
    { id: 'cameras', label: 'Camera Management', icon: Camera },
    { id: 'zones', label: 'Safety Zones', icon: Shield },
    { id: 'alerts', label: 'Alert Settings', icon: Bell },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const renderCameraSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Camera {i + 1}</h4>
              <div className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-red-500' : 'bg-green-500'}`}></div>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Camera name"
                defaultValue={`Camera ${i + 1} - Zone ${String.fromCharCode(65 + i)}`}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="RTSP URL"
                defaultValue={`rtsp://192.168.1.${10 + i}:554/stream`}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium">
        <Save className="h-4 w-4" />
        <span>Save Camera Settings</span>
      </button>
    </div>
  );

  const renderZoneSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Define Restricted Zones</h4>
        <div className="bg-gray-800 aspect-video rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <p className="text-white text-center">
              Click and drag to define restricted zones<br/>
              <span className="text-sm opacity-75">Zone drawing interface would be implemented here</span>
            </p>
          </div>
          {/* Sample restricted zones */}
          <div className="absolute top-4 right-4 w-32 h-24 border-2 border-red-400 border-dashed bg-red-400 bg-opacity-20">
            <div className="bg-red-400 text-white text-xs px-2 py-1">Danger Zone</div>
          </div>
          <div className="absolute bottom-4 left-4 w-28 h-20 border-2 border-yellow-400 border-dashed bg-yellow-400 bg-opacity-20">
            <div className="bg-yellow-400 text-black text-xs px-2 py-1">Caution</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3">Zone Types</h5>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-yellow-500" />
              <span className="text-sm">Restricted Access</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-yellow-500" />
              <span className="text-sm">PPE Required</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-yellow-500" />
              <span className="text-sm">Equipment Only</span>
            </label>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3">Alert Triggers</h5>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-yellow-500" />
              <span className="text-sm">Zone Entry Without PPE</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-yellow-500" />
              <span className="text-sm">Unauthorized Access</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-yellow-500" />
              <span className="text-sm">Loitering Detection</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlertSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Methods</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="text-yellow-500" />
                  <span className="text-sm">Email Notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="text-yellow-500" />
                  <span className="text-sm">SMS Alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="text-yellow-500" />
                  <span className="text-sm">Push Notifications</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Frequency</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500">
                <option>Immediate</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Hourly Summary</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Severity Levels</span>
          </h4>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-red-400 bg-red-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-800">Critical</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              <p className="text-sm text-red-600 mt-1">Immediate safety threat</p>
            </div>
            
            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-yellow-800">High</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              <p className="text-sm text-yellow-600 mt-1">PPE violations, zone breaches</p>
            </div>
            
            <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Medium</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              <p className="text-sm text-blue-600 mt-1">Minor safety concerns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900">System Users</h4>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium">
          Add User
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { name: 'Admin User', email: 'admin@safetywatch.com', role: 'Administrator', status: 'Active', lastLogin: '2 hours ago' },
              { name: 'Safety Manager', email: 'safety@safetywatch.com', role: 'Manager', status: 'Active', lastLogin: '1 day ago' },
              { name: 'Site Supervisor', email: 'supervisor@safetywatch.com', role: 'Supervisor', status: 'Inactive', lastLogin: '3 days ago' },
            ].map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'cameras':
        return renderCameraSettings();
      case 'zones':
        return renderZoneSettings();
      case 'alerts':
        return renderAlertSettings();
      case 'users':
        return renderUserSettings();
      default:
        return renderCameraSettings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Administration Settings</h2>
        <p className="text-gray-600">Configure system settings and manage safety monitoring parameters</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-yellow-500">
              <h3 className="font-semibold text-black flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </h3>
            </div>
            <nav className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-yellow-100 text-yellow-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;