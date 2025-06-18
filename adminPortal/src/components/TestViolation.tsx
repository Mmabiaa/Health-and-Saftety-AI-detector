import React from 'react';
import { violationService } from '../services/violationService';
import { cameraStreamService } from '../services/cameraStreamService';

const TestViolation: React.FC = () => {
  const createTestViolation = () => {
    const testViolation = {
      workerId: `Worker-${Math.floor(Math.random() * 1000)}`,
      entryPoint: 'Main Entrance - Gate A',
      attempts: [
        {
          success: false,
          missingEquipment: ['Hard Hat', 'Safety Vest'],
          timestamp: new Date(),
          imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+PC9zdmc+'
        },
        {
          success: false,
          missingEquipment: ['Safety Goggles'],
          timestamp: new Date(),
          imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+PC9zdmc+'
        },
        {
          success: false,
          missingEquipment: ['Gloves'],
          timestamp: new Date(),
          imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+PC9zdmc+'
        }
      ],
      totalAttempts: 3,
      timestamp: new Date(),
    };

    violationService.addViolation(testViolation);
    alert('Test violation created! Check the Violations tab.');
  };

  const createTestSuccessRecord = () => {
    const testSuccessRecord = {
      workerId: `Worker-${Math.floor(Math.random() * 1000)}`,
      entryPoint: 'Main Entrance - Gate A',
      attempts: [
        {
          success: true,
          missingEquipment: [],
          timestamp: new Date(),
          imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN1Y2Nlc3MgSW1hZ2U8L3RleHQ+PC9zdmc+'
        }
      ],
      totalAttempts: 1,
      timestamp: new Date(),
      duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 seconds
    };

    violationService.addSuccessRecord(testSuccessRecord);
    alert('Test success record created! Check the Records tab.');
  };

  const createTestCameraStream = () => {
    const testStream = {
      workerId: `Worker-${Math.floor(Math.random() * 1000)}`,
      entryPoint: 'Main Entrance - Gate A',
      streamId: cameraStreamService.generateStreamId(),
      timestamp: new Date(),
      isActive: true,
      imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpdmUgQ2FtZXJhPC90ZXh0Pjwvc3ZnPg=='
    };

    cameraStreamService.addStream(testStream);
    alert('Test camera stream created! Check the Dashboard for live feeds.');
  };

  const clearAllData = () => {
    violationService.clearAllData();
    alert('All data cleared!');
  };

  const clearAllStreams = () => {
    cameraStreamService.clearStreams();
    alert('All camera streams cleared!');
  };

  const downloadTestData = () => {
    violationService.downloadRecords('csv');
    alert('Test data downloaded as CSV!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border-emerald-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Test Data Generation</h2>
        <p className="text-slate-600 mb-6">
          Use these buttons to test the data flow between worker portal and admin portal.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Violation Testing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Violation Testing</h3>
            <div className="flex space-x-2">
              <button
                onClick={createTestViolation}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Create Test Violation
              </button>
              
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Clear All Data
              </button>
            </div>
          </div>

          {/* Success Record Testing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Success Record Testing</h3>
            <div className="flex space-x-2">
              <button
                onClick={createTestSuccessRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Success Record
              </button>
              
              <button
                onClick={downloadTestData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Download Data
              </button>
            </div>
          </div>

          {/* Camera Stream Testing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Live Camera Testing</h3>
            <div className="flex space-x-2">
              <button
                onClick={createTestCameraStream}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Create Test Stream
              </button>
              
              <button
                onClick={clearAllStreams}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Clear Streams
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-medium text-slate-800 mb-2">Instructions:</h3>
          <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
            <li><strong>Violation Testing:</strong> Create test violations to see them in the Violations tab</li>
            <li><strong>Success Record Testing:</strong> Create test success records to see them in the Records tab</li>
            <li><strong>Live Camera Testing:</strong> Create test camera streams to see them in the Dashboard</li>
            <li><strong>Download Data:</strong> Download all records as CSV file</li>
            <li><strong>Clear Data:</strong> Use clear buttons to reset test data when finished</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestViolation; 