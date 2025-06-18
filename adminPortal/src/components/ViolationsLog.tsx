import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, Camera, AlertTriangle, Clock } from 'lucide-react';
import { violationService, Violation } from '../services/violationService';

const ViolationsLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [violations, setViolations] = useState<Violation[]>([]);

  useEffect(() => {
    // Subscribe to violation updates
    const unsubscribe = violationService.subscribe((updatedViolations) => {
      setViolations(updatedViolations);
    });

    // Load initial violations
    setViolations(violationService.getViolations());

    return unsubscribe;
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.entryPoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || violation.severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusUpdate = (violationId: string, newStatus: 'pending' | 'investigating' | 'resolved') => {
    violationService.updateViolationStatus(violationId, newStatus);
  };

  const getViolationType = (violation: Violation): string => {
    const allMissing = violation.attempts.flatMap(attempt => attempt.missingEquipment);
    const uniqueMissing = [...new Set(allMissing)];
    return `Missing: ${uniqueMissing.join(', ')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Safety Violations Log</h2>
        <p className="text-slate-600">Review and manage all safety incident reports from worker portal</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-emerald-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search violations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        {filteredViolations.map((violation) => (
          <div key={violation.id} className="bg-white rounded-xl shadow-lg border-l-4 border-red-400 overflow-hidden border-emerald-200">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-emerald-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{getViolationType(violation)}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(violation.severity || 'medium')}`}>
                          {(violation.severity || 'medium').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status || 'pending')}`}>
                          {(violation.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{violation.timestamp.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Camera className="h-4 w-4" />
                          <span>{violation.entryPoint}</span>
                        </div>
                        <div>
                          <span className="font-medium">Worker:</span> {violation.workerId}
                        </div>
                      </div>

                      {/* Show captured images */}
                      {violation.attempts.some(attempt => attempt.imageData) && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Captured Images:</p>
                          <div className="flex space-x-2 overflow-x-auto">
                            {violation.attempts
                              .filter(attempt => attempt.imageData)
                              .map((attempt, index) => (
                                <img
                                  key={index}
                                  src={attempt.imageData}
                                  alt={`Attempt ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4 lg:mt-0">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                    View Details
                  </button>
                  {violation.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(violation.id!, 'investigating')}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                      >
                        Investigate
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(violation.id!, 'resolved')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                  {violation.status === 'investigating' && (
                    <button 
                      onClick={() => handleStatusUpdate(violation.id!, 'resolved')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredViolations.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-emerald-200">
          <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">No violations found</h3>
          <p className="text-slate-600">All safety protocols are being followed correctly.</p>
        </div>
      )}
    </div>
  );
};

export default ViolationsLog;