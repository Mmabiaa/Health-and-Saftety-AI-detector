import React, { useState, useEffect } from 'react';
import { AlertTriangle, Camera, User, X, Calendar, Clock, MapPin, Search, Download, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SafetyCheck, Worker } from '../types/database';

interface ViolationWithWorker extends SafetyCheck {
  worker?: Worker;
  severity: 'low' | 'medium' | 'high';
  cameraNumber: string;
}

const ENTRY_POINT_CAMERA_MAP = {
  'Main entrance-Gate A': 'Cam 1',
  'North shaft entry': 'Cam 2',
  'South shaft entry': 'Cam 4',
  'Equipment Bay-Section B': 'Cam 5',
  'Processing Plant entry': 'Cam 3',
  'Administration Building': 'Cam 6',
  'Emergency Exit-Zone C': 'Cam 8',
  'Maintenance Workshop': 'Cam 7'
} as const;

type EntryPoint = keyof typeof ENTRY_POINT_CAMERA_MAP;

const ViolationsLog: React.FC = () => {
  const [violations, setViolations] = useState<ViolationWithWorker[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<ViolationWithWorker | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const getSeverity = (violationCount: number): 'low' | 'medium' | 'high' => {
    if (violationCount <= 1) return 'low';
    if (violationCount < 3) return 'medium';
    return 'high';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe':
        return 'bg-green-100 text-green-800';
      case 'Not Safe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCameraNumber = (entryPoint: string): string => {
    return ENTRY_POINT_CAMERA_MAP[entryPoint as EntryPoint] || 'Unknown Camera';
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      full: date.toLocaleString()
    };
  };

  const fetchViolations = async () => {
    setLoading(true);
    const { data: safetyChecks, error } = await supabase
      .from('safety_checks')
      .select('*')
      .eq('status', 'Not Safe')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching violations:', error);
      setLoading(false);
      return;
    }

    const violationsWithDetails = (safetyChecks || []).map((check) => {
      const violations = check.violations || [];
      return {
        ...check,
        severity: getSeverity(violations.length),
        cameraNumber: getCameraNumber(check.entry_point)
      };
    });

    setViolations(violationsWithDetails);
    setLoading(false);
  };

  const fetchWorkerDetails = async (workerId: string) => {
    setModalLoading(true);
    const { data: workerData, error } = await supabase
      .from('workers')
      .select('*')
      .eq('worker_id', workerId)
      .single();

    if (error) {
      console.error('Error fetching worker details:', error);
      setSelectedWorker(null);
    } else {
      setSelectedWorker(workerData);
    }
    setModalLoading(false);
  };

  const handleViewDetails = async (violation: ViolationWithWorker) => {
    setSelectedViolation(violation);
    await fetchWorkerDetails(violation.worker_id);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Worker ID', 'Entry Point', 'Camera', 'Status', 'Severity', 'Violations'];
    const csvData = filteredViolations.map(v => [
      formatDateTime(v.timestamp).date,
      formatDateTime(v.timestamp).time,
      v.worker_id,
      v.entry_point,
      v.cameraNumber,
      v.status,
      v.severity,
      v.violations ? v.violations.join('; ') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `safety_violations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = 
      violation.worker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.entry_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.violations?.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  useEffect(() => {
    fetchViolations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Safety Violations Log</h2>
        <p className="text-gray-600">Review and manage all safety incident reports</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search violations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        /* Violations List */
        <div className="space-y-4">
          {filteredViolations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No violations found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            filteredViolations.map((violation) => (
              <div key={violation.id} className="bg-white rounded-xl shadow-lg border-l-4 border-red-400 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {violation.violations && violation.violations.length > 0 
                                ? violation.violations[0] 
                                : 'Safety Violation'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(violation.severity)}`}>
                              {violation.severity.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                              {violation.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatDateTime(violation.timestamp).full}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Camera className="h-4 w-4" />
                              <span>{violation.cameraNumber} - {violation.entry_point}</span>
                            </div>
                            <div>
                              <span className="font-medium">Worker:</span> {violation.worker_id}
                            </div>
                          </div>

                          {violation.violations && violation.violations.length > 1 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-500">
                                +{violation.violations.length - 1} more violation(s)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4 lg:mt-0">
                      <button 
                        onClick={() => handleViewDetails(violation)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {violation.status === 'Not Safe' && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedViolation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                {modalLoading ? (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : selectedWorker?.profile_picture_url ? (
                  <img
                    src={selectedWorker.profile_picture_url}
                    alt={selectedWorker.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {modalLoading ? 'Loading...' : selectedWorker?.name || 'Unknown Worker'}
                  </h2>
                  {!modalLoading && selectedWorker && (
                    <>
                      <p className="text-gray-600">{selectedWorker.title}</p>
                      <p className="text-gray-600">{selectedWorker.department}</p>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedViolation(null);
                  setSelectedWorker(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Worker ID</h3>
                <p className="text-gray-600">{selectedViolation.worker_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedViolation.status)}`}>
                  {selectedViolation.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Severity</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(selectedViolation.severity)}`}>
                  {selectedViolation.severity.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Camera</h3>
                <p className="text-gray-600">{selectedViolation.cameraNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Entry Point</h3>
                <p className="text-gray-600">{selectedViolation.entry_point}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Date & Time</h3>
                <p className="text-gray-600">
                  {formatDateTime(selectedViolation.timestamp).full}
                </p>
              </div>
            </div>

            {selectedViolation.violations && selectedViolation.violations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Violations</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2">
                    {selectedViolation.violations.map((violation, index) => (
                      <li key={index} className="text-gray-600">
                        {violation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationsLog;