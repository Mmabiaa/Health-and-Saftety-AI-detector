import React, { useState } from 'react';
import { Users, Search, Plus, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const WorkerOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const workers = [
    {
      id: 1847,
      name: 'John Martinez',
      role: 'Construction Foreman',
      helmetColor: 'yellow',
      status: 'active',
      lastSeen: '2 min ago',
      violations: 1,
      safetyScore: 85,
      zone: 'Zone B'
    },
    {
      id: 2134,
      name: 'Sarah Chen',
      role: 'Site Engineer',
      helmetColor: 'white',
      status: 'active',
      lastSeen: '5 min ago',
      violations: 2,
      safetyScore: 78,
      zone: 'Zone E'
    },
    {
      id: 987,
      name: 'Michael Johnson',
      role: 'Equipment Operator',
      helmetColor: 'blue',
      status: 'active',
      lastSeen: '1 min ago',
      violations: 0,
      safetyScore: 96,
      zone: 'Zone A'
    },
    {
      id: 3456,
      name: 'David Rodriguez',
      role: 'Electrician',
      helmetColor: 'green',
      status: 'break',
      lastSeen: '15 min ago',
      violations: 1,
      safetyScore: 88,
      zone: 'Zone D'
    },
    {
      id: 5678,
      name: 'Emily Wilson',
      role: 'Safety Inspector',
      helmetColor: 'red',
      status: 'active',
      lastSeen: '3 min ago',
      violations: 1,
      safetyScore: 92,
      zone: 'Zone C'
    }
  ];

  const getHelmetColor = (color: string) => {
    const colors = {
      yellow: 'bg-yellow-400',
      white: 'bg-white border-2 border-gray-300',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'break':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.id.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Worker Overview</h2>
        <p className="text-gray-600">Monitor and manage worker profiles and safety records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Active</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <Shield className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Violations</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Add Worker */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search workers by name, ID, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full sm:w-80"
            />
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium">
            <Plus className="h-4 w-4" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${getHelmetColor(worker.helmetColor)} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-black">#{worker.id}</span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    worker.status === 'active' ? 'bg-green-500' : 
                    worker.status === 'break' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                  <p className="text-sm text-gray-600">{worker.role}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                    {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Safety Score</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSafetyScoreColor(worker.safetyScore)}`}>
                    {worker.safetyScore}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Violations</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    worker.violations === 0 ? 'bg-green-100 text-green-800' :
                    worker.violations <= 2 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {worker.violations}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Zone</span>
                  <span className="text-sm font-medium text-gray-900">{worker.zone}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Seen</span>
                  <span className="text-sm text-gray-900">{worker.lastSeen}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default WorkerOverview;