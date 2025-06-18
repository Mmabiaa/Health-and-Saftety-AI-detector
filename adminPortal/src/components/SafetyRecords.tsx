import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, Camera, CheckCircle, XCircle, FileText, Database } from 'lucide-react';
import { violationService, SafetyRecord } from '../services/violationService';

const SafetyRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [records, setRecords] = useState<SafetyRecord[]>([]);
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'json'>('csv');

  useEffect(() => {
    // Subscribe to record updates
    const unsubscribe = violationService.subscribeToRecords((updatedRecords) => {
      setRecords(updatedRecords);
    });

    // Load initial records
    setRecords(violationService.getAllRecords());

    return unsubscribe;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.entryPoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || record.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (format: 'csv' | 'json', filterType?: 'all' | 'success' | 'failed') => {
    let recordsToDownload = records;
    
    if (filterType === 'success') {
      recordsToDownload = violationService.getSuccessRecords();
    } else if (filterType === 'failed') {
      recordsToDownload = violationService.getFailedRecords();
    }
    
    violationService.downloadRecords(format, recordsToDownload);
  };

  const getStatistics = () => {
    return violationService.getStatistics();
  };

  const stats = getStatistics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Safety Records</h2>
        <p className="text-slate-600">Complete history of all safety verification attempts</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Records</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalRecords}</p>
            </div>
            <Database className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Successful</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.successRecords}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedRecords}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Success Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.successRate}</p>
            </div>
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-emerald-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search records..."
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
              <option value="all">All Records</option>
              <option value="success">Successful Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as 'csv' | 'json')}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            
            <button 
              onClick={() => handleDownload(downloadFormat, selectedFilter as 'all' | 'success' | 'failed')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Download {selectedFilter === 'all' ? 'All' : selectedFilter === 'success' ? 'Successful' : 'Failed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow-lg border-l-4 border-emerald-400 overflow-hidden border-emerald-200">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${
                      record.status === 'success' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {getStatusIcon(record.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {record.status === 'success' ? 'Safety Verification Passed' : 'Safety Verification Failed'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{record.timestamp.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Camera className="h-4 w-4" />
                          <span>{record.entryPoint}</span>
                        </div>
                        <div>
                          <span className="font-medium">Worker:</span> {record.workerId}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Attempts:</span> {record.totalAttempts} | 
                        {record.duration && <span> Duration: {record.duration}s |</span>}
                        <span> Final Result: {record.finalResult}</span>
                      </div>

                      {/* Show captured images */}
                      {record.attempts.some(attempt => attempt.imageData) && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Captured Images:</p>
                          <div className="flex space-x-2 overflow-x-auto">
                            {record.attempts
                              .filter(attempt => attempt.imageData)
                              .map((attempt, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={attempt.imageData}
                                    alt={`Attempt ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                                  />
                                  <div className={`absolute top-0 right-0 w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                                    attempt.success ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                  }`}>
                                    {attempt.success ? '✓' : '✗'}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-emerald-200">
          <Database className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">No records found</h3>
          <p className="text-slate-600">No safety verification records match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SafetyRecords; 