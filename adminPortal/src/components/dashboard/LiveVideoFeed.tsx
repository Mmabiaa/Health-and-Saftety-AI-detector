import React from 'react';
import { Camera, Settings, Play, Pause, RotateCcw } from 'lucide-react';

interface LiveVideoFeedProps {
  selectedCamera: string;
}

const LiveVideoFeed: React.FC<LiveVideoFeedProps> = ({ selectedCamera }) => {
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

  const selectedCameraData = cameras.find(cam => cam.id === selectedCamera);

  return (
    <div className="bg-white rounded-xl shadow-lg border-emerald-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            <span>Live Video Feed</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-slate-900 rounded-lg overflow-hidden mb-4">
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Camera className="h-16 w-16 mx-auto mb-4" />
              <p className="font-medium mb-2">{selectedCameraData?.name}</p>
              <p className="text-sm">{selectedCameraData?.location}</p>
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                selectedCameraData?.status === 'online' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  selectedCameraData?.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
                <span>{selectedCameraData?.status === 'online' ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
              <Play className="h-4 w-4" />
              <span>Start Recording</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-1 px-3 py-1 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveVideoFeed;