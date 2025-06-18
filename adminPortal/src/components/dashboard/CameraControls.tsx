import React from 'react';
import { Camera, Grid, List, Settings } from 'lucide-react';

interface CameraControlsProps {
  selectedCamera: string;
  onCameraChange: (camera: string) => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({ selectedCamera, onCameraChange }) => {
  const entryPoints = [
    'Main Entrance - Gate A',
    'North Shaft Entry',
    'South Shaft Entry',
    'Equipment Bay - Section B',
    'Processing Plant Entry',
    'Administration Building',
    'Emergency Exit - Zone C',
    'Maintenance Workshop'
  ];

  const cameras = entryPoints.map((entryPoint, index) => ({
    id: `camera-${index + 1}`,
    name: `Camera ${index + 1}`,
    location: entryPoint,
    status: Math.random() > 0.2 ? 'online' : 'offline'
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg border-emerald-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            <span>Camera Controls</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <Grid className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <List className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => onCameraChange(camera.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedCamera === camera.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">{camera.name}</h4>
                <div className={`w-2 h-2 rounded-full ${
                  camera.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
              </div>
              <p className="text-xs text-slate-600 mb-2">{camera.location}</p>
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                camera.status === 'online' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span>{camera.status === 'online' ? 'Online' : 'Offline'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraControls;