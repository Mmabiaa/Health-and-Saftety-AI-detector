import React, { useState, useEffect } from 'react';
import StatsCards from './dashboard/StatsCards';
import LiveVideoFeed from './dashboard/LiveVideoFeed';
import RealTimeAlerts from './dashboard/RealTimeAlerts';
import CameraControls from './dashboard/CameraControls';
import LiveCameraFeed from './LiveCameraFeed';

const Dashboard: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState('camera-1');
  const [alerts, setAlerts] = useState<any[]>([]);

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const violationTypes = ['No Helmet', 'Unsafe Zone', 'Missing PPE', 'Improper Ladder Use'];
        const cameras = ['Camera 1', 'Camera 2', 'Camera 3'];
        
        const newAlert = {
          id: Date.now(),
          type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
          camera: cameras[Math.floor(Math.random() * cameras.length)],
          timestamp: new Date(),
          severity: Math.random() > 0.5 ? 'high' : 'medium',
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Safety Control Center</h2>
        <p className="text-slate-600">Monitor worker safety across all active zones in real-time</p>
      </div>

      <StatsCards />
      
      {/* Live Camera Feeds Section */}
      <div className="mt-8 mb-8">
        <LiveCameraFeed />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <LiveVideoFeed selectedCamera={selectedCamera} />
          <CameraControls 
            selectedCamera={selectedCamera}
            onCameraChange={setSelectedCamera}
          />
        </div>
        
        <div className="space-y-6">
          <RealTimeAlerts alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;