import React from 'react';
import { Camera, Wifi, WifiOff } from 'lucide-react';

interface CameraControlsProps {
  selectedCamera: string;
  onCameraChange: (camera: string) => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({ selectedCamera, onCameraChange }) => {
  const cameras = [
    { id: 'camera-1', name: 'Main Entrance', zone: 'Zone A', status: 'online' },
    { id: 'camera-2', name: 'Construction Floor 1', zone: 'Zone B', status: 'online' },
    { id: 'camera-3', name: 'Equipment Area', zone: 'Zone C', status: 'offline' },
    { id: 'camera-4', name: 'Loading Dock', zone: 'Zone D', status: 'online' },
    { id: 'camera-5', name: 'Scaffolding Area', zone: 'Zone E', status: 'online' },
    { id: 'camera-6', name: 'Tool Storage', zone: 'Zone F', status: 'maintenance' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-3 w-3" />;
      case 'offline':
        return <WifiOff className="h-3 w-3" />;
      case 'maintenance':
        return <Wifi className="h-3 w-3" />;
      default:
        return <WifiOff className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Camera className="h-5 w-5 text-blue-500" />
          <span>Camera Controls</span>
        </h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => onCameraChange(camera.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                selectedCamera === camera.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm text-gray-900">{camera.name}</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camera.status)}`}>
                  {getStatusIcon(camera.status)}
                  <span className="capitalize">{camera.status}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{camera.zone}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraControls;